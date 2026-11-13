"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/imageUpload";
import SafeImage from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

export default function ImageUploader({
  value,
  onChange,
  userId,
  folder = "gig",
  maxSide = 1600,
  shape = "wide",
  label = "Image",
  hint = "JPG, PNG or WebP, up to 5 MB.",
  error: externalError = "",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, { userId, folder, maxSide });
      onChange(url);
    } catch (problem) {
      setUploadError(problem.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const round = shape === "avatar";
  const shownError = uploadError || externalError;

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-800">{label}</p>

      <div className="flex flex-wrap items-center gap-4">
        <div
          className={cn(
            "overflow-hidden border border-slate-200 bg-slate-100",
            round ? "h-24 w-24 rounded-full" : "aspect-[16/10] w-full max-w-xs rounded-xl"
          )}
        >
          {value ? (
            <SafeImage src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <ImagePlus className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="sr-only"
            aria-label={`Choose ${label.toLowerCase()} file`}
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading..." : value ? "Replace image" : "Choose image"}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 transition hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          )}
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
      </div>

      {shownError && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {shownError}
        </p>
      )}
    </div>
  );
}