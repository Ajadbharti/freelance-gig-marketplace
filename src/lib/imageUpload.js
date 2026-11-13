import { createClient } from "@/lib/supabase/client";

export const MAX_UPLOAD_MB = 5;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file is not a valid image."));
    };
    img.src = url;
  });
}

// Image ko chhota karke WebP banata hai
async function shrink(file, maxSide) {
  const img = await loadImage(file);
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(img, 0, 0, width, height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  if (!blob) throw new Error("Could not process this image.");
  return blob;
}

export async function uploadImage(file, { userId, folder = "misc", maxSide = 1600 }) {
  if (!ACCEPTED.includes(file.type)) throw new Error("Please choose a JPG, PNG or WebP image.");
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    throw new Error(`The image must be smaller than ${MAX_UPLOAD_MB} MB.`);
  }

  const blob = await shrink(file, maxSide);
  const path = `${userId}/${folder}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  const supabase = createClient();
  const { error } = await supabase.storage.from("images").upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    const message = (error.message || "").toLowerCase();
    if (message.includes("row-level security") || message.includes("not found")) {
      throw new Error("Uploads are not set up yet. Run the storage SQL script in Supabase first.");
    }
    throw new Error(error.message || "Upload failed. Please try again.");
  }

  return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
}