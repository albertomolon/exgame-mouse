import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../authentication/AuthenticationProvider";
import { socket } from "./io";
import { SocketIoContext } from "./SocketIoContext";

export const SocketIoProvider = ({ children }: { children: React.ReactNode }) => {

  const [connected, setConnected] = useState(false);
  const { username } = useContext(AuthenticationContext);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('register', username);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      setConnected(false);
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  return (
    <SocketIoContext.Provider value={{ socket, connected }}>
      {children}
    </SocketIoContext.Provider>
  );
}