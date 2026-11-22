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

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to process local image."));
    reader.readAsDataURL(blob);
  });
}

export async function uploadImage(file, { userId, folder = "misc", maxSide = 1600 }) {
  if (!ACCEPTED.includes(file.type)) throw new Error("Please choose a JPG, PNG or WebP image.");
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    throw new Error(`The image must be smaller than ${MAX_UPLOAD_MB} MB.`);
  }

  const blob = await shrink(file, maxSide);
  const path = `${userId}/${folder}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  try {
    const supabase = createClient();
    const { error } = await supabase.storage.from("images").upload(path, blob, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) {
      const message = (error.message || "").toLowerCase();
      // If Supabase storage bucket isn't created yet or RLS policy is missing:
      if (message.includes("row-level security") || message.includes("not found") || message.includes("bucket")) {
        console.warn(
          "Supabase storage bucket 'images' not configured yet or RLS blocked. Falling back to inline WebP data URL. Run supabase/storage.sql in Supabase to enable cloud storage."
        );
        return await blobToDataUrl(blob);
      }
      // Attempt fallback anyway so the user's workflow is never completely interrupted
      console.warn("Storage upload failed, using local WebP fallback:", error.message);
      return await blobToDataUrl(blob);
    }

    return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  } catch (err) {
    console.warn("Supabase client unavailable, using local WebP fallback:", err);
    return await blobToDataUrl(blob);
  }
}
