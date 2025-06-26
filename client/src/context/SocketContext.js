import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log('Initializing Socket.IO connection');
    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem('token') },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      if (user) {
        console.log(`Emitting join for user: ${user.id}`);
        newSocket.emit('join', user.id);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    setSocket(newSocket);

    return () => {
      console.log('Disconnecting socket');
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user) {
      console.log(`Re-emitting join for user: ${user.id}`);
      socket.emit('join', user.id);
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};