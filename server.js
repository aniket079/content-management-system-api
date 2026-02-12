import  "dotenv/config"
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import http from "http";
import connectDB from "./config/db.js";

import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets/socket.js";

const PORT = process.env.PORT || 3000;
 

// connectDB();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});

// 🔥 Register socket logic
registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
