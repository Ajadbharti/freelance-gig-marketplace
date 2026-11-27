const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Category = require("../models/Category");

const INITIAL_CATEGORIES = [
  {
    name: "Web Development",
    slug: "web-development",
    icon: "Code",
    description: "Full-stack web applications, custom platforms, Next.js, React, and frontend systems",
  },
  {
    name: "Graphics and Design",
    slug: "graphics-design",
    icon: "Palette",
    description: "Enterprise UI/UX systems, product design, brand identity & Figma architectures",
  },
  {
    name: "Writing and Translation",
    slug: "writing-translation",
    icon: "PenLine",
    description: "Engineering documentation, whitepapers, developer advocacy & technical copy",
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    icon: "TrendingUp",
    description: "Technical SEO audits, growth engineering & programmatic content distribution",
  },
  {
    name: "Video and Animation",
    slug: "video-animation",
    icon: "Video",
    description: "3D product renders, interactive motion graphics & executive video editing",
  },
  {
    name: "Data and AI",
    slug: "data-ai",
    icon: "Cpu",
    description: "LLM fine-tuning, RAG pipelines, agentic workflows & machine learning models",
  },
  {
    name: "Programming and Technology",
    slug: "programming-technology",
    icon: "Terminal",
    description: "Backend architectures, REST APIs, microservices, cloud infrastructure & smart contracts",
  },
  {
    name: "Business",
    slug: "business",
    icon: "Briefcase",
    description: "Operations consulting, financial modeling, marketplace auditing & compliance",
  },
];

const seedCategories = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gig_marketplace";
    await mongoose.connect(mongoUri);
    console.log("[Seed] Connected to MongoDB for categories");

    for (const cat of INITIAL_CATEGORIES) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`[Seed] Created category: ${cat.name}`);
      }
    }

    console.log("[Seed] Categories seeding complete.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[Seed Error]", err.message);
    process.exit(1);
  }
};

seedCategories();
