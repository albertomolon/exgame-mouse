import { instrument } from "@socket.io/admin-ui";
import http from "http";
import { Server } from "socket.io";
import { SubscriptionAction, User } from "./types";

// Follow https://socket.io/docs/v4/server-application-structure/ for organizing handlers

export const initSocketIo = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        const allowed = [
          "https://admin.socket.io",
          "http://localhost:5173",
          "http://localhost:5173/" // per sicurezza se il browser aggiunge lo slash
        ];
        if (!origin || allowed.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true
    },
  });

  instrument(io, {
    auth: false
  });

  /**
   * Keep track of all connected users
   */
  let users: User[] = [];

  io.on("connection", (socket) => {
    const user: User = { id: socket.id, data: {}, actions: [], currentSubscriptionId: undefined };
    console.log("Si è connesso", socket.id);

    // Helper to register user actions
    const registerAction = (action: string) => {
      const data: SubscriptionAction = { subscriptionId: user.currentSubscriptionId || "", action, timestamp: Date.now() };
      console.log("Action from", user.name, ":", data);
      user.actions.push(data);
    }

    socket.on("disconnect", () => {
      console.log("Si è disconnesso", socket.id, user.name);
      users = users.filter((user) => user.id !== socket.id);
      io.emit("Utenti connessi", users);
    });

    socket.on("register", (name: string) => {
      user.name = name;
      users.push(user);
      io.emit("users", users);
      console.log("Si è registrato", name, "Utenti connessi", users);
    });

    // Quando l'utente atterra su una pagina "subscription", associa la socket a quella sottoscrizione
    socket.on("currentSubscription", (subscriptionId: string) => {
      user.currentSubscriptionId = subscriptionId;
    });

    socket.on("disturb", () => { // evento generato dal client per disturbare gli altri
      registerAction("disturb");
      socket.broadcast.emit("disturb", { from: user.name });
    });

    socket.on("copy", () => {
      registerAction("copy");
      if (!user.currentSubscriptionId) {
        console.log("Utente non associato a una sottoscrizione, impossibile copiare i dati");
        return;
      }

      // Trovo un utente a caso che ha dati salvati per questa sottoscrizione (diverso dall'utente corrente)
      const usersWithData = users 
        .filter(u => u.id !== user.id)
        .filter(u => u.data[user.currentSubscriptionId!]);  //filtro tutti quelli che sono nel mio stesso esame e hanno dati salvati

      // Se non ci sono utenti con dati, esco
      if (usersWithData.length === 0) {
        console.log("Nessun altro utente con dati salvati per questa sottoscrizione");
        return;
      }

      // Prendo un utente a caso e invio i suoi dati all'utente corrente
      const randomUser = usersWithData[Math.floor(Math.random() * usersWithData.length)];

      if (!randomUser) {
        console.log("Nessun utente trovato da cui copiare i dati");
        return;
      }

      // Invio i dati salvati per la sottoscrizione corrente
      const randomData = randomUser.data?.[user.currentSubscriptionId!];
      console.log(`L'utente ${user.name} sta copiando i dati da ${randomUser.name}:`, randomData);
      socket.emit("copy", randomData);
    });

    // Viene chiamato quando l'utente aggiorna le sue risposte (serve per permettere agli altri di copiare)
    socket.on("updateResponses", (responses) => {
      registerAction("updateResponses");
      if (!user.currentSubscriptionId) {
        console.log("Utente non associato a una sottoscrizione, impossibile salvare le risposte");
        return;
      }

      user.data[user.currentSubscriptionId] = responses; // salvo le risposte per la sottoscrizione corrente
      console.log('users', JSON.stringify(users, null, 2)); // debug puramente visivo per vedere i dati salvati
    });
  })
}

//SERVER SOCKET.IO
