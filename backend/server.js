import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/config.js';

import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { socketHandler } from './socket/socketHandler.js';
import { urlencoded } from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Rotalar
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io bağlantısı
socketHandler(io);

// MongoDB bağlantısı başlat
connectDB();

const PORT = process.env.PORT 
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
