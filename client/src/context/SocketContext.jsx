// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

const apiUrl = import.meta.env.VITE_API_URL;

const cashierSocket = io(`${apiUrl}/cashier`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

const kitchenSocket = io(`${apiUrl}/kitchen`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

const GrillSocket = io(`${apiUrl}/grill`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

const BarSocket = io(`${apiUrl}/bar`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

const waiterSocket = io(`${apiUrl}/waiter`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export const SocketProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      const handleConnectError = (error) => {
        console.error("Socket connection error:", error);
        toast.error("هناك مشكلة في نظام الإشعارات");
      };

      cashierSocket.on("connect_error", handleConnectError);
      kitchenSocket.on("connect_error", handleConnectError);
      GrillSocket.on("connect_error", handleConnectError);
      BarSocket.on("connect_error", handleConnectError);
      waiterSocket.on("connect_error", handleConnectError);

      return () => {
        cashierSocket.off("connect_error", handleConnectError);
        kitchenSocket.off("connect_error", handleConnectError);
        GrillSocket.off("connect_error", handleConnectError);
        BarSocket.off("connect_error", handleConnectError);
        waiterSocket.off("connect_error", handleConnectError);

        cashierSocket.disconnect();
        kitchenSocket.disconnect();
        GrillSocket.disconnect();
        BarSocket.disconnect();
        waiterSocket.disconnect();
      };
    }
  }, [isOnline]);

  return (
    <SocketContext.Provider
      value={{
        cashierSocket,
        kitchenSocket,
        GrillSocket,
        BarSocket,
        waiterSocket,
        isOnline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
