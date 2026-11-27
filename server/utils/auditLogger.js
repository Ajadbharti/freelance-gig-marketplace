const AdminAuditLog = require("../models/AdminAuditLog");

const logAdminAction = async ({
  admin,
  action,
  targetResource,
  targetResourceId,
  previousValue = null,
  newValue = null,
  reason = "Administrative action",
  req = null,
}) => {
  try {
    const ip = req ? req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "" : "";
    await AdminAuditLog.create({
      adminId: admin._id || admin.id,
      adminEmail: admin.email,
      action,
      targetResource,
      targetResourceId: String(targetResourceId),
      previousValue,
      newValue,
      reason,
      ipAddress: String(ip),
    });
  } catch (err) {
    console.error("[AuditLog Error]", err.message);
  }
};

module.exports = { logAdminAction };
