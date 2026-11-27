const User = require("../models/User");
const Gig = require("../models/Gig");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Payment = require("../models/Payment");
const Category = require("../models/Category");
const Report = require("../models/Report");
const AdminAuditLog = require("../models/AdminAuditLog");
const { logAdminAction } = require("../utils/auditLogger");

// ==========================================
// 1. DASHBOARD TELEMETRY & STATS
// ==========================================
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalFreelancers,
      totalClients,
      activeUsers,
      suspendedUsers,
      totalGigs,
      pendingGigs,
      publishedGigs,
      totalOrders,
      completedOrders,
      cancelledOrders,
      paymentsSummary,
      recentLogs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "freelancer" }),
      User.countDocuments({ role: "client" }),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: { $in: ["suspended", "blocked"] } }),
      Gig.countDocuments(),
      Gig.countDocuments({ status: "pending" }),
      Gig.countDocuments({ status: { $in: ["published", "approved"] } }),
      Order.countDocuments(),
      Order.countDocuments({ status: "completed" }),
      Order.countDocuments({ status: "cancelled" }),
      Payment.aggregate([
        {
          $group: {
            _id: null,
            totalVolume: { $sum: "$amount" },
            transactionCount: { $sum: 1 },
          },
        },
      ]),
      AdminAuditLog.find().sort({ createdAt: -1 }).limit(8),
    ]);

    const simulatedVolume = paymentsSummary.length > 0 ? paymentsSummary[0].totalVolume : 0;
    const transactionCount = paymentsSummary.length > 0 ? paymentsSummary[0].transactionCount : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFreelancers,
        totalClients,
        activeUsers,
        suspendedUsers,
        totalGigs,
        pendingGigs,
        publishedGigs,
        totalOrders,
        completedOrders,
        cancelledOrders,
        simulatedVolume,
        transactionCount,
      },
      recentLogs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch dashboard stats." });
  }
};

// ==========================================
// 2. USER MANAGEMENT
// ==========================================
exports.getAllUsers = async (req, res) => {
  try {
    const { search = "", role = "all", status = "all", page = 1, limit = 20 } = req.query;
    const query = {};

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (role !== "all") query.role = role;
    if (status !== "all") query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch users." });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });

    const [userGigs, clientOrders, freelancerOrders, reviews] = await Promise.all([
      user.role === "freelancer" ? Gig.find({ freelancerId: user._id }) : [],
      Order.find({ clientId: user._id }).sort({ createdAt: -1 }).limit(10),
      Order.find({ freelancerId: user._id }).sort({ createdAt: -1 }).limit(10),
      Review.find({ $or: [{ clientId: user._id }, { freelancerId: user._id }] }).sort({ createdAt: -1 }).limit(10),
    ]);

    res.status(200).json({
      success: true,
      user,
      activity: {
        gigs: userGigs,
        clientOrders,
        freelancerOrders,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch user details." });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status, reason = "" } = req.body;
    if (!["active", "suspended", "blocked"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found." });

    // Safety guard: cannot suspend self
    if (String(targetUser._id) === String(req.user._id)) {
      return res.status(400).json({ error: "Self-action prohibited: you cannot suspend or block your own administrator account." });
    }

    // Safety guard: cannot suspend last active administrator
    if (targetUser.role === "admin" && status !== "active") {
      const activeAdmins = await User.countDocuments({ role: "admin", status: "active" });
      if (activeAdmins <= 1) {
        return res.status(400).json({ error: "Cannot suspend the platform's last active administrator." });
      }
    }

    const prevStatus = targetUser.status;
    targetUser.status = status;
    targetUser.suspensionReason = reason;
    await targetUser.save();

    await logAdminAction({
      admin: req.user,
      action: status === "active" ? "REACTIVATE_USER" : "SUSPEND_USER",
      targetResource: "User",
      targetResourceId: targetUser._id,
      previousValue: { status: prevStatus },
      newValue: { status, reason },
      reason,
      req,
    });

    res.status(200).json({
      success: true,
      message: `User status changed to ${status}.`,
      user: targetUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update user status." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found." });

    // Safety guard: cannot delete self
    if (String(targetUser._id) === String(req.user._id)) {
      return res.status(400).json({ error: "Self-deletion prohibited: you cannot delete your own account." });
    }

    // Safety guard: cannot delete last active administrator
    if (targetUser.role === "admin") {
      const activeAdmins = await User.countDocuments({ role: "admin", status: "active" });
      if (activeAdmins <= 1) {
        return res.status(400).json({ error: "Prohibited: cannot delete the last active administrator." });
      }
    }

    await User.findByIdAndDelete(targetUser._id);

    await logAdminAction({
      admin: req.user,
      action: "DELETE_USER",
      targetResource: "User",
      targetResourceId: targetUser._id,
      previousValue: { email: targetUser.email, role: targetUser.role },
      newValue: null,
      reason: req.body?.reason || "Account permanently deleted by Administrator",
      req,
    });

    res.status(200).json({ success: true, message: "User account deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete user." });
  }
};

// ==========================================
// 3. FREELANCER & CLIENT SHORTCUTS
// ==========================================
exports.getFreelancers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const query = { role: "freelancer" };

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [freelancers, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      freelancers,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch freelancers." });
  }
};

exports.verifyFreelancer = async (req, res) => {
  try {
    const { verified } = req.body;
    const freelancer = await User.findOne({ _id: req.params.id, role: "freelancer" });
    if (!freelancer) return res.status(404).json({ error: "Freelancer profile not found." });

    const prevVerified = freelancer.isVerified;
    freelancer.isVerified = Boolean(verified);
    await freelancer.save();

    await logAdminAction({
      admin: req.user,
      action: verified ? "VERIFY_FREELANCER" : "REVOKE_FREELANCER_VERIFICATION",
      targetResource: "User",
      targetResourceId: freelancer._id,
      previousValue: { isVerified: prevVerified },
      newValue: { isVerified: freelancer.isVerified },
      reason: req.body?.reason || "Audited verification badge review",
      req,
    });

    res.status(200).json({
      success: true,
      message: `Freelancer verification set to ${freelancer.isVerified}.`,
      freelancer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update verification status." });
  }
};

exports.getClients = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const query = { role: "client" };

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [clients, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      clients,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch clients." });
  }
};

// ==========================================
// 4. GIGS & APPROVAL WORKFLOW
// ==========================================
exports.getGigs = async (req, res) => {
  try {
    const { status = "all", search = "", category = "all", page = 1, limit = 20 } = req.query;
    const query = {};

    if (status !== "all") query.status = status;
    if (category !== "all") query.category = category;
    if (search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [gigs, total] = await Promise.all([
      Gig.find(query)
        .populate("freelancerId", "name email avatar isVerified")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Gig.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      gigs,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch gigs." });
  }
};

exports.approveGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: "Gig specification not found." });

    const prevStatus = gig.status;
    gig.status = "published"; // or "approved"
    gig.rejectionReason = "";
    await gig.save();

    await logAdminAction({
      admin: req.user,
      action: "APPROVE_GIG",
      targetResource: "Gig",
      targetResourceId: gig._id,
      previousValue: { status: prevStatus },
      newValue: { status: gig.status },
      reason: req.body?.reason || "Compliant with specification standard",
      req,
    });

    res.status(200).json({
      success: true,
      message: "Gig approved and published to catalog.",
      gig,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to approve gig." });
  }
};

exports.rejectGig = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "Rejection reason is mandatory." });
    }

    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: "Gig specification not found." });

    const prevStatus = gig.status;
    gig.status = "rejected";
    gig.rejectionReason = reason.trim();
    await gig.save();

    await logAdminAction({
      admin: req.user,
      action: "REJECT_GIG",
      targetResource: "Gig",
      targetResourceId: gig._id,
      previousValue: { status: prevStatus },
      newValue: { status: "rejected", reason: gig.rejectionReason },
      reason: gig.rejectionReason,
      req,
    });

    res.status(200).json({
      success: true,
      message: "Gig specification rejected.",
      gig,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to reject gig." });
  }
};

exports.suspendGig = async (req, res) => {
  try {
    const { reason = "Violates marketplace terms" } = req.body;
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: "Gig specification not found." });

    const prevStatus = gig.status;
    gig.status = "suspended";
    gig.rejectionReason = reason;
    await gig.save();

    await logAdminAction({
      admin: req.user,
      action: "SUSPEND_GIG",
      targetResource: "Gig",
      targetResourceId: gig._id,
      previousValue: { status: prevStatus },
      newValue: { status: "suspended", reason },
      reason,
      req,
    });

    res.status(200).json({
      success: true,
      message: "Gig suspended from public exploration.",
      gig,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to suspend gig." });
  }
};

// ==========================================
// 5. CATEGORIES MANAGEMENT
// ==========================================
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    // Count active gigs per category
    const gigCounts = await Gig.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countsMap = {};
    gigCounts.forEach((c) => {
      countsMap[c._id] = c.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat.toObject(),
      gigsCount: countsMap[cat.slug] || countsMap[cat.name] || 0,
    }));

    res.status(200).json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch categories." });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description = "", icon = "LayoutGrid", image = "" } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: "Category name and slug are required." });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const existing = await Category.findOne({ $or: [{ slug: cleanSlug }, { name }] });
    if (existing) {
      return res.status(400).json({ error: "Category with this name or slug already exists." });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: cleanSlug,
      description,
      icon,
      image,
    });

    await logAdminAction({
      admin: req.user,
      action: "CREATE_CATEGORY",
      targetResource: "Category",
      targetResourceId: category._id,
      newValue: category,
      reason: "Added new category node",
      req,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create category." });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, icon, image, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found." });

    const prev = category.toObject();
    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();

    await logAdminAction({
      admin: req.user,
      action: "UPDATE_CATEGORY",
      targetResource: "Category",
      targetResourceId: category._id,
      previousValue: prev,
      newValue: category,
      reason: "Updated category properties",
      req,
    });

    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update category." });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found." });

    // Safety guard: Cannot delete category if active gigs exist
    const activeGigsCount = await Gig.countDocuments({
      category: { $in: [category.slug, category.name] },
      status: { $in: ["published", "pending", "approved"] },
    });

    if (activeGigsCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category: ${activeGigsCount} active or pending gigs currently belong to it. Reassign those gigs first.`,
      });
    }

    await Category.findByIdAndDelete(category._id);

    await logAdminAction({
      admin: req.user,
      action: "DELETE_CATEGORY",
      targetResource: "Category",
      targetResourceId: category._id,
      previousValue: category,
      newValue: null,
      reason: "Category removed from taxonomy",
      req,
    });

    res.status(200).json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete category." });
  }
};

// ==========================================
// 6. ORDERS MANAGEMENT
// ==========================================
exports.getOrders = async (req, res) => {
  try {
    const { status = "all", search = "", page = 1, limit = 20 } = req.query;
    const query = {};

    if (status !== "all") query.status = status;
    if (search.trim()) {
      query.code = { $regex: search.trim(), $options: "i" };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("clientId", "name email avatar")
        .populate("freelancerId", "name email avatar")
        .populate("gigId", "title category price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch orders." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("clientId", "name email avatar")
      .populate("freelancerId", "name email avatar")
      .populate("gigId", "title category price deliveryDays");

    if (!order) return res.status(404).json({ error: "Order contract not found." });

    const payment = await Payment.findOne({ orderId: order._id });
    const review = await Review.findOne({ orderId: order._id });

    res.status(200).json({
      success: true,
      order,
      payment,
      review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch order details." });
  }
};

// ==========================================
// 7. REVIEWS MANAGEMENT
// ==========================================
exports.getReviews = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const query = {};

    if (search.trim()) {
      query.comment = { $regex: search.trim(), $options: "i" };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("clientId", "name email avatar")
        .populate("freelancerId", "name email avatar")
        .populate("gigId", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Review.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch reviews." });
  }
};

exports.toggleHideReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found." });

    const prev = review.isHidden;
    review.isHidden = !review.isHidden;
    await review.save();

    await logAdminAction({
      admin: req.user,
      action: review.isHidden ? "HIDE_REVIEW" : "UNHIDE_REVIEW",
      targetResource: "Review",
      targetResourceId: review._id,
      previousValue: { isHidden: prev },
      newValue: { isHidden: review.isHidden },
      reason: req.body?.reason || "Review visibility moderation",
      req,
    });

    res.status(200).json({
      success: true,
      message: `Review is now ${review.isHidden ? "hidden from public" : "visible"}.`,
      review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to moderate review." });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found." });

    await Review.findByIdAndDelete(review._id);

    await logAdminAction({
      admin: req.user,
      action: "DELETE_REVIEW",
      targetResource: "Review",
      targetResourceId: review._id,
      previousValue: review,
      newValue: null,
      reason: req.body?.reason || "Inappropriate review deleted",
      req,
    });

    res.status(200).json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete review." });
  }
};

// ==========================================
// 8. PAYMENTS MANAGEMENT
// ==========================================
exports.getPayments = async (req, res) => {
  try {
    const { status = "all", page = 1, limit = 20 } = req.query;
    const query = {};
    if (status !== "all") query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate("clientId", "name email")
        .populate("freelancerId", "name email")
        .populate("orderId", "code price status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Payment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch payments." });
  }
};

// ==========================================
// 9. REPORTS & COMPLAINTS
// ==========================================
exports.getReports = async (req, res) => {
  try {
    const { status = "all", page = 1, limit = 20 } = req.query;
    const query = {};
    if (status !== "all") query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate("reporterId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Report.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      reports,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch reports." });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { status, notes = "" } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found." });

    const prev = report.toObject();
    report.status = status;
    report.resolutionNotes = notes;
    await report.save();

    await logAdminAction({
      admin: req.user,
      action: "RESOLVE_REPORT",
      targetResource: "Report",
      targetResourceId: report._id,
      previousValue: prev,
      newValue: report,
      reason: notes || `Report status updated to ${status}`,
      req,
    });

    res.status(200).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update report status." });
  }
};

// ==========================================
// 10. AUDIT LOGS
// ==========================================
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [logs, total] = await Promise.all([
      AdminAuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      AdminAuditLog.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch audit logs." });
  }
};

// ==========================================
// 11. INSPECTION VIEWS (MANAGE AS CLIENT / FREELANCER)
// ==========================================
exports.getClientDashboard = async (req, res) => {
  try {
    const client = await User.findById(req.params.id).select("-password");
    if (!client) {
      return res.status(404).json({ error: "Client account not found." });
    }

    const [orders, reviews] = await Promise.all([
      Order.find({ clientId: client._id }).sort({ createdAt: -1 }),
      Review.find({ clientId: client._id }).sort({ createdAt: -1 }),
    ]);

    const completedOrders = orders.filter((o) => o.status === "completed");
    const activeOrders = orders.filter((o) => o.status === "active" || o.status === "in-progress");
    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const cancelledOrders = orders.filter((o) => o.status === "cancelled");

    const totalSpent = completedOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const inEscrow = activeOrders.concat(deliveredOrders).reduce((sum, o) => sum + (Number(o.price) || 0), 0);

    res.status(200).json({
      success: true,
      client,
      dashboard: {
        stats: {
          totalOrders: orders.length,
          activeOrders: activeOrders.length,
          deliveredOrders: deliveredOrders.length,
          completedOrders: completedOrders.length,
          cancelledOrders: cancelledOrders.length,
          totalSpent,
          inEscrow,
        },
        orders,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch client dashboard." });
  }
};

exports.getFreelancerDashboard = async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id).select("-password");
    if (!freelancer) {
      return res.status(404).json({ error: "Freelancer account not found." });
    }

    const [gigs, orders, reviews] = await Promise.all([
      Gig.find({ freelancerId: freelancer._id }).sort({ createdAt: -1 }),
      Order.find({ freelancerId: freelancer._id }).sort({ createdAt: -1 }),
      Review.find({ freelancerId: freelancer._id }).sort({ createdAt: -1 }),
    ]);

    const completedOrders = orders.filter((o) => o.status === "completed");
    const activeOrders = orders.filter((o) => o.status === "active" || o.status === "in-progress");
    const totalEarned = completedOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const avgRating =
      reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1) : 5.0;

    res.status(200).json({
      success: true,
      freelancer,
      dashboard: {
        stats: {
          totalGigs: gigs.length,
          publishedGigs: gigs.filter((g) => g.status === "published" || g.status === "approved").length,
          pendingGigs: gigs.filter((g) => g.status === "pending").length,
          totalOrders: orders.length,
          activeOrders: activeOrders.length,
          completedOrders: completedOrders.length,
          totalEarned,
          avgRating: Number(avgRating),
          reviewsCount: reviews.length,
        },
        gigs,
        orders,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch freelancer dashboard." });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found." });

    const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "azadbharati802223@gmail.com").toLowerCase();

    // Prevent any change of role to admin or from admin
    if (req.body.role === "admin" && targetUser.email.toLowerCase() !== SUPER_ADMIN_EMAIL) {
      return res.status(400).json({ error: "Forbidden: Super Admin role cannot be granted." });
    }

    const { name, title, bio, skills, hourlyRate, isVerified, status } = req.body;
    const previous = {
      name: targetUser.name,
      title: targetUser.title,
      bio: targetUser.bio,
      isVerified: targetUser.isVerified,
      status: targetUser.status,
    };

    if (name) targetUser.name = name.trim();
    if (title !== undefined) targetUser.title = title;
    if (bio !== undefined) targetUser.bio = bio;
    if (Array.isArray(skills)) targetUser.skills = skills;
    if (hourlyRate !== undefined) targetUser.hourlyRate = Number(hourlyRate);
    if (isVerified !== undefined) targetUser.isVerified = Boolean(isVerified);
    if (status && ["active", "suspended", "blocked"].includes(status)) {
      targetUser.status = status;
    }

    await targetUser.save();

    await logAdminAction({
      admin: req.user,
      action: "UPDATE_USER_PROFILE",
      targetResource: "User",
      targetResourceId: targetUser._id,
      previousValue: previous,
      newValue: {
        name: targetUser.name,
        title: targetUser.title,
        isVerified: targetUser.isVerified,
        status: targetUser.status,
      },
      reason: req.body?.reason || "Profile updated by Super Administrator",
      req,
    });

    res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      user: targetUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update user profile." });
  }
};
