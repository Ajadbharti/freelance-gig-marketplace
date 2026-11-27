const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getFreelancers,
  verifyFreelancer,
  getClients,
  getGigs,
  approveGig,
  rejectGig,
  suspendGig,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  getOrderById,
  getReviews,
  toggleHideReview,
  deleteReview,
  getPayments,
  getReports,
  updateReportStatus,
  getAuditLogs,
  getClientDashboard,
  getFreelancerDashboard,
  updateUserProfile,
} = require("../controllers/adminController");

// All admin routes require protect AND adminOnly
router.use(protect, adminOnly);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/users/:id/profile", updateUserProfile);
router.delete("/users/:id", deleteUser);

// Freelancers & Clients Management & Inspection
router.get("/freelancers", getFreelancers);
router.get("/freelancers/:id/dashboard", getFreelancerDashboard);
router.patch("/freelancers/:id/verify", verifyFreelancer);
router.get("/clients", getClients);
router.get("/clients/:id/dashboard", getClientDashboard);

// Gigs
router.get("/gigs", getGigs);
router.patch("/gigs/:id/approve", approveGig);
router.patch("/gigs/:id/reject", rejectGig);
router.patch("/gigs/:id/suspend", suspendGig);

// Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Orders
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);

// Reviews
router.get("/reviews", getReviews);
router.patch("/reviews/:id/visibility", toggleHideReview);
router.delete("/reviews/:id", deleteReview);

// Payments
router.get("/payments", getPayments);

// Reports
router.get("/reports", getReports);
router.patch("/reports/:id", updateReportStatus);

// Audit Logs
router.get("/audit-logs", getAuditLogs);

module.exports = router;
