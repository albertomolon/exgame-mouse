import { createContext } from "react";
import type { Socket } from "socket.io-client";

type SocketIoContextType = {
  socket: Socket | null;
  connected: boolean;
};

export const SocketIoContext = createContext<SocketIoContextType>({ socket: null, connected: false });

