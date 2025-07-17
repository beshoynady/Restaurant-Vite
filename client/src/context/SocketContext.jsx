// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

// Create Context
const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

// API Base
const apiUrl = import.meta.env.VITE_API_URL;

// Helper to create socket
const createSocket = (namespace) =>
  io(`${apiUrl}/${namespace}`, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    transports: ["websocket"], // optional: force WebSocket
  });

export const SocketProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Track Internet connection state
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

  // Create sockets once
  const [sockets, setSockets] = useState({
    cashierSocket: null,
    kitchenSocket: null,
    GrillSocket: null,
    BarSocket: null,
    waiterSocket: null,
  });

  useEffect(() => {
    if (!isOnline) return;

    // Create all sockets
    const cashierSocket = createSocket("cashier");
    const kitchenSocket = createSocket("kitchen");
    const GrillSocket = createSocket("grill");
    const BarSocket = createSocket("bar");
    const waiterSocket = createSocket("waiter");

    // Handle connection errors
    const handleError = (error) => {
      console.error("Socket connection error:", error);
      toast.error("⚠️ مشكلة في نظام الإشعارات");
    };

    [cashierSocket, kitchenSocket, GrillSocket, BarSocket, waiterSocket].forEach((socket) => {
      socket.on("connect_error", handleError);
    });

    setSockets({
      cashierSocket,
      kitchenSocket,
      GrillSocket,
      BarSocket,
      waiterSocket,
    });

    return () => {
      [cashierSocket, kitchenSocket, GrillSocket, BarSocket, waiterSocket].forEach((socket) => {
        socket.off("connect_error", handleError);
        socket.disconnect();
      });
    };
  }, [isOnline]);

  return (
    <SocketContext.Provider
      value={{
        ...sockets,
        isOnline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
