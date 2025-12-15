import { useContext, useEffect, useState } from "react";
import { SocketIoContext } from "../socketio/SocketIoContext";
import { ChatVisibilityContext } from "./ChatVisibility";
import styles from "./FloatingChat.module.css";

// Assicurati che ChatVisibilityContext abbia queste proprietà
interface ChatVisibilityContextType {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

const FloatingChat = () => {
  const { isVisible, setIsVisible } = useContext(ChatVisibilityContext) as ChatVisibilityContextType;
  const socketIoContext = useContext(SocketIoContext);
  const socket = socketIoContext?.socket;
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<{ from?: string; text: string }[]>([]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const invia = () => {
    console.log("Messaggio inviato:", message);
    socket?.emit("chatMessage", message);
    setMessage("");
  }

  useEffect(() => {
    socket?.on("chatMessageList", (messages: { from?: string; text: string }[]) => {
      setMessageList(messages);
    });

    return () => {
      socket?.off("chatMessageList");
    }
  }, [socket]);

  if (!isVisible) return null;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <h3>Chat</h3>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>
        <div className={styles.chatMessages}>
          {messageList.length === 0 && <p className={styles.emptyMessage}>Nessun messaggio</p>}
          {messageList.map((msg, index) => (
            <div key={index} className={styles.chatMessage}>
              <strong>{msg.from || "Anonimo"}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className={styles.chatInput}>
          <input
            type="text"
            placeholder="Scrivi un messaggio..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button onClick={invia}>Invia</button>
        </div>
      </div>
    </div>
  );
};

export default FloatingChat;