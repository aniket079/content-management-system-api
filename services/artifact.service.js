import Artifact from "../models/artifact.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
/**
 * Create a new artifact
 */
export const createArtifactService = async ({
  title,
  content,
  userId,
  filePath,
}) => {
  if (!title || !content) {
    throw new Error("Title and content are required");
  }
  
 let mediaUrl = null
  if (filePath) {
    const uploadResult = await cloudinary.uploader.upload(
      filePath,
      {
        folder: "cms-artifacts"
      }
    );

    mediaUrl = uploadResult.secure_url;

    // 🔹 Delete local file after upload
    fs.unlinkSync(filePath);
  }
  console.log("MEDIA URL BEFORE SAVE:", mediaUrl);

  const artifact = await Artifact.create({
    title,
    content,
    author: userId,
    media:mediaUrl || null
  });

  return artifact;
};









export const getArtifactsService = async ({ userId, role }) => {
  if (role === "ADMIN") {
    // Admin sees everything
    return await Artifact.find().populate("author", "name email role");
  }

  // Non-admin sees only their own artifacts
  return await Artifact.find({ author: userId });
};



