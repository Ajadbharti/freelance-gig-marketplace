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

    const adminEmail = (process.env.ADMIN_EMAIL || "azadbharati802223@gmail.com").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "AzadSecureAdminPass2026!";
    const adminName = process.env.ADMIN_NAME || "Azad Bharti (Platform Owner)";

    // 1. Demote any other accounts that might previously have had 'admin' role
    const legacyAdmins = await User.updateMany(
      { role: "admin", email: { $ne: adminEmail } },
      { $set: { role: "client" } }
    );
    if (legacyAdmins.modifiedCount > 0) {
      console.log(`[Seed] Demoted ${legacyAdmins.modifiedCount} unauthorized admin accounts to client role.`);
    }

    // 2. Provision or update the single designated Super Admin
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.name = adminName;
      admin.role = "admin";
      admin.status = "active";
      admin.isVerified = true;
      admin.password = adminPassword; // Hashes in pre-save hook
      await admin.save();
      console.log(`[Seed] Super Admin updated: ${adminEmail}`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        status: "active",
        isVerified: true,
      });
      console.log(`[Seed] Single Super Admin account provisioned: ${adminEmail}`);
    }

    console.log("==========================================");
    console.log("SUPER ADMIN CONFIGURATION VERIFIED");
    console.log(`Designated Email : ${adminEmail}`);
    console.log(`Role             : admin (Single Super Admin)`);
    console.log("==========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[Seed Error]", err.message);
    process.exit(1);
  }
};

seedAdmin();
