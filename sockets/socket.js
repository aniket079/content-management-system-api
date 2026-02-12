import { sendChatService } from "../services/chat.service.js";

export const registerSocketHandlers = (io) => {

  // 🔥 In-memory store for online users
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ==========================================
    // USER ONLINE
    // ==========================================
    socket.on("user-online", (userId) => {

      onlineUsers.set(userId, socket.id);

      console.log("Online Users:", onlineUsers);
    });

    // ==========================================
    // SEND MESSAGE
    // ==========================================
    socket.on("send-message", async (data) => {

      try {
        const { senderId, receiverId, message } = data;

        if (!senderId || !receiverId || !message) {
          return;
        }

        

        // 1️⃣ Save message in DB
        // const chat = await sendChatService({
        //   senderId,
        //   receiverId,
        //   message
        // });

        // 2️⃣ Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", data);
        }

        // 3️⃣ Also emit back to sender (for confirmation)
        socket.emit("message-sent", data);

      } catch (error) {
        console.log("Socket error:", error.message);
      }

    });

    // ==========================================
    // DISCONNECT
    // ==========================================
    socket.on("disconnect", () => {

      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      console.log("User disconnected:", socket.id);
    });

  });
};
