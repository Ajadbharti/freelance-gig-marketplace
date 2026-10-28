"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Briefcase, CalendarDays, CheckCircle2, Languages, MapPin, Pencil, SearchX } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import Modal from "@/components/ui/Modal";
import SafeImage from "@/components/ui/SafeImage";
import RatingStars from "@/components/ui/RatingStars";
import PriceDisplay from "@/components/ui/PriceDisplay";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import FormField, { inputClass } from "@/components/ui/FormField";
import GigCard from "@/components/gigs/GigCard";
import ReviewCard from "@/components/reviews/ReviewCard";
import { formatDate } from "@/lib/utils";

const toList = (text) =>
  text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10" role="status" aria-label="Loading profile">
      <div className="flex items-center gap-5">
        <LoadingSkeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="h-8 w-1/3" />
          <LoadingSkeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <LoadingSkeleton className="h-64 w-full" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function EditProfileForm({ freelancer, onClose }) {
  const { updateFreelancerProfile } = useMarketplace();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      headline: freelancer.headline,
      bio: freelancer.bio,
      location: freelancer.location,
      skills: freelancer.skills.join(", "),
      languages: freelancer.languages.join(", "),
      experience: String(freelancer.experience),
      startingPrice: String(freelancer.startingPrice),
      avatar: freelancer.avatar,
    },
  });

  function onSubmit(values) {
    const result = updateFreelancerProfile(freelancer.id, {
      headline: values.headline.trim(),
      bio: values.bio.trim(),
      location: values.location.trim(),
      skills: toList(values.skills),
      languages: toList(values.languages),
      experience: Number(values.experience),
      startingPrice: Number(values.startingPrice),
      avatar: values.avatar.trim() || freelancer.avatar,
    });
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    showToast("Profile updated successfully.");
    onClose();
  }

  const field = (name) => ({
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField id="headline" label="Professional headline" error={errors.headline?.message}>
        <input
          id="headline"
          type="text"
          className={inputClass}
          {...field("headline")}
          {...register("headline", {
            required: "Headline is required.",
            minLength: { value: 5, message: "Headline must be at least 5 characters." },
            maxLength: { value: 80, message: "Keep the headline under 80 characters." },
          })}
        />
      </FormField>

      <FormField id="bio" label="About you" error={errors.bio?.message}>
        <textarea
          id="bio"
          rows={5}
          className={inputClass}
          {...field("bio")}
          {...register("bio", { maxLength: { value: 600, message: "Keep the bio under 600 characters." } })}
        />
      </FormField>

      <FormField id="location" label="Location" error={errors.location?.message}>
        <input
          id="location"
          type="text"
          placeholder="City, Country"
          className={inputClass}
          {...field("location")}
          {...register("location", { maxLength: { value: 60, message: "Keep the location under 60 characters." } })}
        />
      </FormField>

      <FormField
        id="skills"
        label="Skills"
        hint="Separate skills with commas."
        error={errors.skills?.message}
      >
        <input
          id="skills"
          type="text"
          placeholder="React, Figma, SEO"
          className={inputClass}
          {...field("skills")}
          {...register("skills", {
            validate: (value) => toList(value).length > 0 || "Add at least one skill.",
          })}
        />
      </FormField>

      <FormField
        id="languages"
        label="Languages"
        hint="Separate languages with commas."
        error={errors.languages?.message}
      >
        <input
          id="languages"
          type="text"
          placeholder="English, Hindi"
          className={inputClass}
          {...field("languages")}
          {...register("languages", {
            validate: (value) => toList(value).length > 0 || "Add at least one language.",
          })}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="experience" label="Experience (years)" error={errors.experience?.message}>
          <input
            id="experience"
            type="number"
            min="0"
            max="60"
            className={inputClass}
            {...field("experience")}
            {...register("experience", {
              validate: (value) => {
                const n = Number(value);
                return (String(value).trim() !== "" && n >= 0 && n <= 60) || "Enter a number from 0 to 60.";
              },
            })}
          />
        </FormField>
        <FormField id="startingPrice" label="Starting price (USD)" error={errors.startingPrice?.message}>
          <input
            id="startingPrice"
            type="number"
            min="0"
            className={inputClass}
            {...field("startingPrice")}
            {...register("startingPrice", {
              validate: (value) => {
                const n = Number(value);
                return (String(value).trim() !== "" && n >= 0 && n <= 100000) || "Enter a valid price.";
              },
            })}
          />
        </FormField>
      </div>

      <FormField id="avatar" label="Profile image URL" error={errors.avatar?.message}>
        <input
          id="avatar"
          type="url"
          placeholder="https://..."
          className={inputClass}
          {...field("avatar")}
          {...register("avatar", {
            pattern: { value: /^$|^https?:\/\/\S+$/i, message: "Enter a valid http(s) image URL." },
          })}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

export default function FreelancerProfile({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { hydrated, getFreelancer, getFreelancerGigs, getFreelancerReviews, getFreelancerRating } =
    useMarketplace();
  const [editOpen, setEditOpen] = useState(false);

  const freelancer = getFreelancer(id);
  const found = Boolean(freelancer);

  // #portfolio jaise link se aane par us section tak scroll karo
  useEffect(() => {
    if (!hydrated || !found) return;
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  }, [hydrated, found]);

  if (!hydrated) return <ProfileSkeleton />;

  if (!freelancer) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <SearchX className="h-14 w-14 text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Freelancer not found</h1>
        <p className="mt-2 text-slate-600">This profile does not exist.</p>
        <Link
          href="/gigs"
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Browse gigs
        </Link>
      </div>
    );
  }

  const isOwner = user?.role === "freelancer" && user.id === freelancer.id;
  const gigs = getFreelancerGigs(freelancer.id);
  const reviews = getFreelancerReviews(freelancer.id);
  const { average, count } = getFreelancerRating(freelancer.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <SafeImage
          src={freelancer.avatar}
          alt={freelancer.name}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{freelancer.name}</h1>
          <p className="mt-1 text-slate-600">{freelancer.headline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <RatingStars rating={average} count={count > 0 ? count : undefined} showNumber />
            {freelancer.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {freelancer.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> {freelancer.completedOrders} orders completed
            </span>
          </div>
        </div>
        {isOwner && (
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" /> Edit profile
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-10">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-xl font-semibold text-slate-900">
              About
            </h2>
            {freelancer.bio ? (
              <p className="mt-3 leading-relaxed text-slate-700">{freelancer.bio}</p>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                {isOwner ? "Add a short bio using Edit profile." : "This freelancer has not added a bio yet."}
              </p>
            )}
          </section>

          <section id="portfolio" aria-labelledby="portfolio-heading" className="scroll-mt-24">
            <h2 id="portfolio-heading" className="text-xl font-semibold text-slate-900">
              Portfolio
            </h2>
            {freelancer.portfolio.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                No portfolio projects yet.
              </p>
            ) : (
              <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {freelancer.portfolio.map((item) => (
                  <figure
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="aspect-[16/10] bg-slate-100">
                      <SafeImage src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <figcaption className="p-3 text-sm font-medium text-slate-800">{item.title}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="gigs-heading">
            <h2 id="gigs-heading" className="text-xl font-semibold text-slate-900">
              Published gigs
            </h2>
            {gigs.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                <p>No gigs published yet.</p>
                {isOwner && (
                  <Link
                    href="/dashboard/freelancer/gigs/new"
                    className="mt-3 inline-block font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Create your first gig
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {gigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="reviews-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="reviews-heading" className="text-xl font-semibold text-slate-900">
                Client reviews
              </h2>
              {count > 0 && <RatingStars rating={average} count={count} showNumber size={18} />}
            </div>
            {reviews.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                No reviews yet.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <PriceDisplay price={freelancer.startingPrice} size="lg" />
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <div>
                  <dt className="text-slate-500">Experience</dt>
                  <dd className="font-medium text-slate-900">
                    {freelancer.experience > 0
                      ? `${freelancer.experience} ${freelancer.experience === 1 ? "year" : "years"}`
                      : "Just getting started"}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Languages className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <div>
                  <dt className="text-slate-500">Languages</dt>
                  <dd className="font-medium text-slate-900">{freelancer.languages.join(", ") || "Not added"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <div>
                  <dt className="text-slate-500">Member since</dt>
                  <dd className="font-medium text-slate-900">{formatDate(freelancer.joinedAt)}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Skills</h2>
            {freelancer.skills.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No skills added yet.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {isOwner && (
        <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
          <EditProfileForm freelancer={freelancer} onClose={() => setEditOpen(false)} />
        </Modal>
      )}
    </div>
  );
}