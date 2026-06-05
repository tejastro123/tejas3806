import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

interface Cursor {
  id: string;
  x: number;
  y: number;
  userName: string;
  page: string;
}

interface SocketContextType {
  socket: Socket | null;
  visitorCount: number;
  typingUsers: Record<string, string>; // socketId -> name
  remoteCursors: Record<string, Cursor>;
  emitTyping: (isTyping: boolean, userName: string) => void;
  emitNotification: (notif: { title: string; message: string; type: string }) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [visitorCount, setVisitorCount] = useState(1);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [remoteCursors, setRemoteCursors] = useState<Record<string, Cursor>>({});
  
  const location = useLocation();

  useEffect(() => {
    // Connect to the API Gateway WebSocket port
    const socketInstance = io(window.location.origin, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    setSocket(socketInstance);

    // Visitor counter
    socketInstance.on("visitor_count", (count: number) => {
      setVisitorCount(count);
    });

    // Real-time Typing Forwarding
    socketInstance.on("typing", (data: { id: string; isTyping: boolean; userName: string }) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        if (data.isTyping) {
          copy[data.id] = data.userName;
        } else {
          delete copy[data.id];
        }
        return copy;
      });
    });

    // Real-time Notification Forwarding
    socketInstance.on("admin_notification", (notif: { title: string; message: string; type: string }) => {
      toast.message(notif.title, {
        description: notif.message,
        duration: 4000
      });
    });

    // Co-Presence Cursors
    socketInstance.on("presence_update", (data: Cursor) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [data.id]: data
      }));
    });

    socketInstance.on("presence_offline", (socketId: string) => {
      setRemoteCursors((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
      setTypingUsers((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Broadcast mouse movements
  useEffect(() => {
    if (!socket) return;

    let throttleTimeout: NodeJS.Timeout | null = null;

    const handleMouseMove = (e: MouseMoveEvent) => {
      if (throttleTimeout) return;

      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        socket.emit("presence", {
          x: e.clientX,
          y: e.clientY,
          page: location.pathname,
          userName: localStorage.getItem("sb-token") ? "Admin" : "Visitor"
        });
      }, 50); // throttle to 50ms (20fps)
    };

    window.addEventListener("mousemove", handleMouseMove as any);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove as any);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [socket, location.pathname]);

  const emitTyping = (isTyping: boolean, userName: string) => {
    if (socket) {
      socket.emit("typing", { isTyping, userName });
    }
  };

  const emitNotification = (notif: { title: string; message: string; type: string }) => {
    if (socket) {
      socket.emit("admin_notification", notif);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      visitorCount,
      typingUsers,
      remoteCursors,
      emitTyping,
      emitNotification
    }}>
      {children}
      
      {/* Remote Cursor Render Layer */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {Object.values(remoteCursors)
          .filter((cursor) => cursor.page === location.pathname)
          .map((cursor) => (
            <div
              key={cursor.id}
              className="absolute transition-all duration-75 ease-out"
              style={{ left: cursor.x, top: cursor.y }}
            >
              {/* Modern Neon Cursor Arrow */}
              <svg
                className="w-5 h-5 text-neon-cyan drop-shadow-[0_0_4px_rgba(6,182,212,0.8)] fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M4.5 3v15.2l3.9-3.9 3.2 7.2 2.7-1.2-3.2-7.2 5.2-.2L4.5 3z" />
              </svg>
              <div className="ml-3 mt-1 px-1.5 py-0.5 rounded bg-black/80 border border-neon-cyan/30 text-[9px] font-mono text-neon-cyan whitespace-nowrap">
                {cursor.userName || "Guest"}
              </div>
            </div>
          ))}
      </div>
    </SocketContext.Provider>
  );
};
