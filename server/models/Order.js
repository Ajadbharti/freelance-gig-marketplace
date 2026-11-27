const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageTier: {
      type: String,
      enum: ["basic", "standard", "premium", "custom"],
      default: "standard",
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "in-progress", "delivered", "revision-requested", "completed", "cancelled"],
      default: "pending",
    },
    requirements: {
      type: String,
      default: "",
    },
    deliveryWork: {
      note: { type: String, default: "" },
      files: { type: [String], default: [] },
      deliveredAt: { type: Date, default: null },
    },
    disputeReason: {
      type: String,
      default: "",
    },
    dueDays: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
