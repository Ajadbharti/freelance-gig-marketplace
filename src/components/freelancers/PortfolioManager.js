"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ImageUploader from "@/components/ui/ImageUploader";
import SafeImage from "@/components/ui/SafeImage";
import { inputClass } from "@/components/ui/FormField";

function AddProjectForm({ userId, onDone }) {
  const { refreshPublic } = useMarketplace();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (cleanTitle.length < 2 || cleanTitle.length > 80) {
      setError("Title must be 2 to 80 characters.");
      return;
    }
    if (!image) {
      setError("Please upload an image for this project.");
      return;
    }

    setSaving(true);
    setError("");
    const { error: dbError } = await createClient()
      .from("portfolio_items")
      .insert({ freelancer_id: userId, title: cleanTitle, image_url: image });
    setSaving(false);

    if (dbError) {
      setError(dbError.message || "Could not save the project.");
      return;
    }
    await refreshPublic();
    showToast("Portfolio project added.");
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="project-title" className="mb-1.5 block text-sm font-medium text-slate-800">
          Project title
        </label>
        <input
          id="project-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Example: Coffee shop website"
          className={inputClass}
        />
      </div>

      <ImageUploader
        label="Project image"
        value={image}
        userId={userId}
        folder="portfolio"
        maxSide={1400}
        shape="wide"
        onChange={(url) => {
          setImage(url);
          setError("");
        }}
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {saving ? "Saving..." : "Add project"}
        </button>
      </div>
    </form>
  );
}

export default function PortfolioManager({ freelancerId }) {
  const { user } = useAuth();
  const { getFreelancer, refreshPublic } = useMarketplace();
  const { showToast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  const freelancer = getFreelancer(freelancerId);
  if (!user || user.id !== freelancerId || !freelancer) return null;

  async function confirmRemove() {
    const target = removeTarget;
    setRemoveTarget(null);
    const { data, error } = await createClient()
      .from("portfolio_items")
      .delete()
      .eq("id", target.id)
      .select("id");
    if (error || !data || data.length === 0) {
      showToast(error?.message || "Could not remove the project.", "error");
      return;
    }
    await refreshPublic();
    showToast("Project removed.");
  }

  return (
    <div className="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Manage your portfolio</p>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add project
        </button>
      </div>

      {freelancer.portfolio.length > 0 && (
        <ul className="mt-4 space-y-2">
          {freelancer.portfolio.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-xl bg-white p-2 shadow-sm">
              <SafeImage src={item.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{item.title}</span>
              <button
                type="button"
                onClick={() => setRemoveTarget(item)}
                aria-label={`Remove ${item.title}`}
                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add portfolio project">
        {addOpen && <AddProjectForm userId={user.id} onDone={() => setAddOpen(false)} />}
      </Modal>

      <ConfirmModal
        open={Boolean(removeTarget)}
        title="Remove this project?"
        message={`"${removeTarget?.title ?? ""}" will be removed from your portfolio.`}
        confirmLabel="Remove"
        danger
        onConfirm={confirmRemove}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}