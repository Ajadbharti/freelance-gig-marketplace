const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gig_marketplace";
    await mongoose.connect(mongoUri);
    console.log("[Seed] Connected to MongoDB");

    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@gigcraft.io";
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "AdminSecurePass2026!";
    const adminName = process.env.INITIAL_ADMIN_NAME || "System Administrator";

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.role = "admin";
      admin.status = "active";
      admin.isVerified = true;
      admin.password = adminPassword; // Hashes in pre-save hook
      await admin.save();
      console.log(`[Seed] Existing user promoted to Administrator: ${adminEmail}`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        status: "active",
        isVerified: true,
      });
      console.log(`[Seed] Initial Administrator created successfully: ${adminEmail}`);
    }

    console.log("------------------------------------------");
    console.log(`Admin Login Email   : ${adminEmail}`);
    console.log(`Admin Login Password: ${adminPassword}`);
    console.log("------------------------------------------");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[Seed Error]", err.message);
    process.exit(1);
  }
};

seedAdmin();
