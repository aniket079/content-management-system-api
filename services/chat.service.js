import Chat from "../models/chat.js";
import Thread from "../models/thread.js";

export const getChatsByThreadService = async (threadId) => {
  return await Chat.find({ thread: threadId })
    .populate("sender", "name email")
    .sort({ createdAt: 1 }); // oldest first
};


export const sendChatService = async ({
  senderId,
  receiverId,
  message
}) => {

  // 🔥 Ensure thread exists
  const thread = await findOrCreateThreadService(senderId, receiverId);

  // Create chat
  const chat = await Chat.create({
    thread: thread._id,
    sender: senderId,
    message
  });

  // Update thread metadata
  thread.lastMessage = message;
  thread.lastMessageAt = new Date();
  await thread.save();

  return chat;
};


export const findOrCreateThreadService = async (userId1, userId2) => {

  // Sort IDs to prevent duplicates
  const participants = [userId1, userId2].sort();

  // Try to find existing thread
  let threads = await Thread.findOne({
    participants: { $all: participants },
    $expr: { $eq: [{ $size: "$participants" }, 2] }
  });

  if (!threads) {
    threads = await Thread.create({
      participants
    });
  }

  return threads;
};


