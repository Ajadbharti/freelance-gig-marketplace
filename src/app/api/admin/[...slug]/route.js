import { NextResponse } from "next/server";
import { categories as defaultCategories } from "@/data/categories";

const EXPRESS_BASE = process.env.EXPRESS_URL || "http://localhost:5000/api/admin";
const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "azadbharati802223@gmail.com").toLowerCase();

// In-memory fallback stores for when Express/MongoDB server is offline
let localCategories = defaultCategories.map((c, i) => ({
  id: `cat-${c.slug || i + 1}`,
  name: c.name,
  slug: c.slug,
  description: c.description || "",
  active: true,
  createdAt: new Date().toISOString(),
}));

let localAuditLogs = [
  {
    id: "log-init-1",
    adminEmail: SUPER_ADMIN_EMAIL,
    action: "SYSTEM_INITIALIZATION",
    targetResource: "PLATFORM_CORE",
    targetResourceId: "gigcraft-core",
    reason: "Platform governance engine started for Azad Bharti (Super Admin)",
    ipAddress: "127.0.0.1",
    createdAt: new Date().toISOString(),
  },
];

let localReports = [
  {
    id: "rep-demo-1",
    reporterEmail: "audit@gigcraft.io",
    targetType: "gig",
    targetId: "gig-verify-01",
    reason: "Escrow compliance and SLA validation review",
    status: "investigating",
    notes: "Automated telemetry scan scheduled",
    createdAt: new Date().toISOString(),
  },
];

// Forward to Express backend if online, otherwise return local mock data
async function proxyOrFallback(request, path, method = "GET", body = null) {
  const expressUrl = `${EXPRESS_BASE}/${path}`;

  try {
    const fetchOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(1000), // 1s timeout to keep UI snappy
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE")) {
      fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(expressUrl, fetchOptions);
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }
  } catch {
    // Express backend is not running - handle gracefully with local data
  }

  // Handle Local Fallback based on path
  return handleLocalFallback(path, method, body);
}

function handleLocalFallback(path, method, body) {
  const parts = path.split("?")[0].split("/").filter(Boolean);
  const resource = parts[0] || "dashboard";
  const id = parts[1];
  const subAction = parts[2];

  // 1. Dashboard Stats
  if (resource === "dashboard") {
    return NextResponse.json({
      stats: {
        totalUsers: 1,
        totalFreelancers: 0,
        totalClients: 0,
        activeUsers: 1,
        suspendedUsers: 0,
        totalGigs: 0,
        pendingGigs: 0,
        publishedGigs: 0,
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        simulatedVolume: 0,
        transactionCount: 0,
      },
    });
  }

  // 2. Users
  if (resource === "users") {
    const defaultUsers = [
      {
        id: "super-admin-azad",
        name: "Azad Bharti (Platform Owner)",
        email: SUPER_ADMIN_EMAIL,
        role: "admin",
        status: "active",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    if (subAction === "status" && method === "PATCH") {
      localAuditLogs.unshift({
        id: `log-${Date.now()}`,
        adminEmail: SUPER_ADMIN_EMAIL,
        action: "UPDATE_USER_STATUS",
        targetResource: "User",
        targetResourceId: id,
        reason: body?.reason || `Status updated to ${body?.status}`,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, message: `Status updated to ${body?.status}` });
    }

    if (subAction === "profile" && method === "PATCH") {
      localAuditLogs.unshift({
        id: `log-${Date.now()}`,
        adminEmail: SUPER_ADMIN_EMAIL,
        action: "UPDATE_USER_PROFILE",
        targetResource: "User",
        targetResourceId: id,
        reason: body?.reason || "Profile updated by Super Admin",
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, message: "User profile updated" });
    }

    if (method === "DELETE") {
      localAuditLogs.unshift({
        id: `log-${Date.now()}`,
        adminEmail: SUPER_ADMIN_EMAIL,
        action: "DELETE_USER",
        targetResource: "User",
        targetResourceId: id,
        reason: body?.reason || "Account permanently purged",
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, message: "User deleted" });
    }

    return NextResponse.json({ users: defaultUsers });
  }

  // 3. Freelancers
  if (resource === "freelancers") {
    if (subAction === "dashboard") {
      return NextResponse.json({
        success: true,
        freelancer: {
          id,
          name: "Sample Specialist",
          email: "specialist@gigcraft.io",
          role: "freelancer",
          status: "active",
          title: "Fullstack Architecture Specialist",
          bio: "Specialist contracting under deterministic escrow milestones.",
        },
        dashboard: {
          stats: {
            totalGigs: 0,
            publishedGigs: 0,
            pendingGigs: 0,
            totalOrders: 0,
            activeOrders: 0,
            completedOrders: 0,
            totalEarned: 0,
            avgRating: 5.0,
            reviewsCount: 0,
          },
          gigs: [],
          orders: [],
          reviews: [],
        },
      });
    }
    return NextResponse.json({ freelancers: [] });
  }

  // 4. Clients
  if (resource === "clients") {
    if (subAction === "dashboard") {
      return NextResponse.json({
        success: true,
        client: {
          id,
          name: "Sample Enterprise Client",
          email: "client@enterprise.io",
          role: "client",
          status: "active",
        },
        dashboard: {
          stats: {
            totalOrders: 0,
            activeOrders: 0,
            deliveredOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
            totalSpent: 0,
            inEscrow: 0,
          },
          orders: [],
          reviews: [],
        },
      });
    }
    return NextResponse.json({ clients: [] });
  }

  // 5. Gigs
  if (resource === "gigs") {
    if (subAction === "approve" && method === "PATCH") {
      localAuditLogs.unshift({
        id: `log-${Date.now()}`,
        adminEmail: SUPER_ADMIN_EMAIL,
        action: "APPROVE_GIG",
        targetResource: "Gig",
        targetResourceId: id,
        reason: body?.reason || "Standard Admin Approval",
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, message: "Gig approved" });
    }

    if (subAction === "reject" && method === "PATCH") {
      localAuditLogs.unshift({
        id: `log-${Date.now()}`,
        adminEmail: SUPER_ADMIN_EMAIL,
        action: "REJECT_GIG",
        targetResource: "Gig",
        targetResourceId: id,
        reason: body?.reason || "Does not meet platform quality standards",
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, message: "Gig rejected" });
    }

    if (subAction === "suspend" && method === "PATCH") {
      localAuditLogs.unshift({
        id: `log-${Date.now()}`,
        adminEmail: SUPER_ADMIN_EMAIL,
        action: "SUSPEND_GIG",
        targetResource: "Gig",
        targetResourceId: id,
        reason: body?.reason || "Violated terms",
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, message: "Gig suspended" });
    }

    return NextResponse.json({ gigs: [] });
  }

  // 6. Categories
  if (resource === "categories") {
    if (method === "POST" && body) {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: body.name || "New Category",
        slug: body.slug || `cat-${Date.now()}`,
        description: body.description || "",
        active: true,
        createdAt: new Date().toISOString(),
      };
      localCategories.push(newCat);
      localAuditLogs.unshift({
        id: `log-${Date.now()}`,
        adminEmail: SUPER_ADMIN_EMAIL,
        action: "CREATE_CATEGORY",
        targetResource: "Category",
        targetResourceId: newCat.id,
        reason: `Created category ${newCat.name}`,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, category: newCat });
    }

    if (method === "DELETE" && id) {
      localCategories = localCategories.filter((c) => c.id !== id && c.slug !== id);
      return NextResponse.json({ ok: true, message: "Category deleted" });
    }

    return NextResponse.json({ categories: localCategories });
  }

  // 7. Orders
  if (resource === "orders") {
    return NextResponse.json({ orders: [] });
  }

  // 8. Reviews
  if (resource === "reviews") {
    return NextResponse.json({ reviews: [] });
  }

  // 9. Payments
  if (resource === "payments") {
    return NextResponse.json({ payments: [] });
  }

  // 10. Reports
  if (resource === "reports") {
    if (method === "PATCH" && id) {
      const rep = localReports.find((r) => r.id === id);
      if (rep) {
        rep.status = body?.status || "resolved";
        rep.notes = body?.notes || "";
      }
      return NextResponse.json({ ok: true, report: rep });
    }
    return NextResponse.json({ reports: localReports });
  }

  // 11. Audit Logs
  if (resource === "audit-logs") {
    return NextResponse.json({ logs: localAuditLogs });
  }

  return NextResponse.json({ ok: true, resource });
}

export async function GET(request, { params }) {
  const resolved = params instanceof Promise ? await params : params;
  const path = (resolved?.slug || []).join("/");
  return proxyOrFallback(request, path, "GET");
}

export async function POST(request, { params }) {
  const resolved = params instanceof Promise ? await params : params;
  const path = (resolved?.slug || []).join("/");
  const body = await request.json().catch(() => ({}));
  return proxyOrFallback(request, path, "POST", body);
}

export async function PUT(request, { params }) {
  const resolved = params instanceof Promise ? await params : params;
  const path = (resolved?.slug || []).join("/");
  const body = await request.json().catch(() => ({}));
  return proxyOrFallback(request, path, "PUT", body);
}

export async function PATCH(request, { params }) {
  const resolved = params instanceof Promise ? await params : params;
  const path = (resolved?.slug || []).join("/");
  const body = await request.json().catch(() => ({}));
  return proxyOrFallback(request, path, "PATCH", body);
}

export async function DELETE(request, { params }) {
  const resolved = params instanceof Promise ? await params : params;
  const path = (resolved?.slug || []).join("/");
  const body = await request.json().catch(() => ({}));
  return proxyOrFallback(request, path, "DELETE", body);
}
