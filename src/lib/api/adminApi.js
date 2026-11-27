const API_BASE = process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000/api/admin";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[adminApi] ${endpoint} request failed:`, err.message);
    throw err;
  }
}

export const adminApi = {
  // 1. Dashboard
  getStats: () => request("/dashboard"),

  // 2. Users
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users?${query}`);
  },
  getUser: (id) => request(`/users/${id}`),
  updateUserStatus: (id, { status, reason }) =>
    request(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
    }),
  deleteUser: (id, { reason }) =>
    request(`/users/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ reason }),
    }),

  // 3. Freelancers & Clients
  getFreelancers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/freelancers?${query}`);
  },
  verifyFreelancer: (id, { verified, reason }) =>
    request(`/freelancers/${id}/verify`, {
      method: "PATCH",
      body: JSON.stringify({ verified, reason }),
    }),
  getClients: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/clients?${query}`);
  },

  // 4. Gigs
  getGigs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/gigs?${query}`);
  },
  approveGig: (id, { reason } = {}) =>
    request(`/gigs/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),
  rejectGig: (id, { reason }) =>
    request(`/gigs/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),
  suspendGig: (id, { reason } = {}) =>
    request(`/gigs/${id}/suspend`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),

  // 5. Categories
  getCategories: () => request("/categories"),
  createCategory: (data) =>
    request("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: "DELETE",
    }),

  // 6. Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders?${query}`);
  },
  getOrder: (id) => request(`/orders/${id}`),

  // 7. Reviews
  getReviews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reviews?${query}`);
  },
  toggleHideReview: (id, { reason } = {}) =>
    request(`/reviews/${id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),
  deleteReview: (id, { reason } = {}) =>
    request(`/reviews/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ reason }),
    }),

  // 8. Payments
  getPayments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/payments?${query}`);
  },

  // 9. Reports
  getReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reports?${query}`);
  },
  updateReportStatus: (id, { status, notes }) =>
    request(`/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    }),

  // 10. Audit Logs
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/audit-logs?${query}`);
  },
};
