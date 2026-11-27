const mongoose = require("mongoose");

const gigPackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  deliveryDays: { type: Number, required: true, default: 2 },
  revisions: { type: Number, required: true, default: 3 },
  features: { type: [String], default: [] },
});

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Gig title is required"],
      trim: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      default: "Custom Specification",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: true,
      min: 5,
    },
    deliveryDays: {
      type: Number,
      default: 2,
    },
    revisions: {
      type: Number,
      default: 3,
    },
    tier: {
      type: String,
      default: "VERIFIED",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    },
    skills: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "published", "suspended"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    packages: {
      basic: { type: gigPackageSchema, default: null },
      standard: { type: gigPackageSchema, default: null },
      premium: { type: gigPackageSchema, default: null },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gig", gigSchema);
