import { Outlet } from "react-router";
import { SocketIoProvider } from "../components/socketio/SocketIoProvider";

export const SocketIoRoute: React.FC = () => {
  return (
    <SocketIoProvider>
      <Outlet />
    </SocketIoProvider>
  );
}