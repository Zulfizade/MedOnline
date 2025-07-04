
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/config.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { socketHandler } from "./socket/socketHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import tipRoutes from "./routes/tipRoutes.js";
import statisticRoutes from "./routes/statisticRoutes.js";

dotenv.config();


const app = express();
const server = http.createServer(app);

// Socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Middleware'ler
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Statik dosyaları servis et (sertifikalar vb.)
app.use("/uploads", express.static("uploads"));

// Rotalar
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);

app.use("/api/contact", contactRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/statistics", statisticRoutes);

// Socket bağlantısı
socketHandler(io);

// Veritabanı bağlantısı
connectDB();

// Sunucu başlat
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});
