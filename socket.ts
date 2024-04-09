import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_HOST_SOCKET;
export const socket = io(URL);
