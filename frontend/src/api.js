const BASE_URL = "http://localhost:5187/api";

const getToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const authHeaders = (customHeaders = {}) => {
  const token = getToken();
  return {
    ...customHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`,
    );
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return await response.json();
  }
  return await response.text();
};

const fetchWithAuth = async (url, options = {}) => {
  let response = await fetch(url, options);

  if (response.status === 401) {
    const accessToken = getToken();
    const refreshToken = getRefreshToken();

    if (accessToken && refreshToken) {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/Auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken, refreshToken }),
        });

        if (refreshResponse.ok) {
          const newTokens = await refreshResponse.json();
          localStorage.setItem("token", newTokens.token);
          localStorage.setItem("refreshToken", newTokens.refreshToken);

          if (!options.headers) options.headers = {};
          options.headers["Authorization"] = `Bearer ${newTokens.token}`;

          response = await fetch(url, options);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
  }
  return handleResponse(response);
};

export const api = {
  auth: {
    login: async (data) => {
      const response = await fetch(`${BASE_URL}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    register: async (data) => {
      const response = await fetch(`${BASE_URL}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
  },

  events: {
    getAll: () =>
      fetchWithAuth(`${BASE_URL}/Events`, { headers: authHeaders() }),
    getById: (id) =>
      fetchWithAuth(`${BASE_URL}/Events/${id}`, { headers: authHeaders() }),
    getBySlug: (slug) =>
      fetchWithAuth(`${BASE_URL}/Events/slug/${slug}`, {
        headers: authHeaders(),
      }),
    create: (data) =>
      fetchWithAuth(`${BASE_URL}/Events`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      fetchWithAuth(`${BASE_URL}/Events/${id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      fetchWithAuth(`${BASE_URL}/Events/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  guests: {
    getAll: (eventId) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Guests`, {
        headers: authHeaders(),
      }),
    getById: (eventId, id) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Guests/${id}`, {
        headers: authHeaders(),
      }),
    create: (eventId, data) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Guests`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    update: (eventId, id, data) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Guests/${id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    delete: (eventId, id) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Guests/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
    updateStatus: (eventId, id, status) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Guests/${id}/status`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ rsvpStatus: status }),
      }),
    submitRsvp: async (eventId, data) => {
      const response = await fetch(
        `${BASE_URL}/events/${eventId}/Guests/rsvp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      return handleResponse(response);
    },
    getByToken: async (token) => {
      const response = await fetch(`${BASE_URL}/rsvp/${token}`);
      return handleResponse(response);
    },
    submitRsvpByToken: async (token, data) => {
      const response = await fetch(`${BASE_URL}/rsvp/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
  },

  vendors: {
    getAll: (eventId) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Vendors`, {
        headers: authHeaders(),
      }),
    getById: (eventId, id) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Vendors/${id}`, {
        headers: authHeaders(),
      }),
    create: (eventId, data) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Vendors`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    update: (eventId, id, data) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Vendors/${id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    delete: (eventId, id) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Vendors/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  seating: {
    getTables: (eventId) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Seating/tables`, {
        headers: authHeaders(),
      }),
    createTable: (eventId, data) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Seating/tables`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    updateTable: (eventId, tableId, data) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Seating/tables/${tableId}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    deleteTable: (eventId, tableId) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Seating/tables/${tableId}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
    assignGuests: (eventId, tableId, guestIds) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Seating/assign`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ guestIds, tableId }),
      }),
    autoAssign: (eventId) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Seating/auto-assign`, {
        method: "POST",
        headers: authHeaders(),
      }),
  },

  photos: {
    getAll: (eventId) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Photos`, {
        headers: authHeaders(),
      }),
    upload: (eventId, formData) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Photos`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      }),
    delete: (eventId, id) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Photos/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  gifts: {
    getAll: (eventId) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Gifts`, {
        headers: authHeaders(),
      }),
    create: (eventId, data) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Gifts`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    update: (eventId, id, data) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Gifts/${id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }),
    delete: (eventId, id) =>
      fetchWithAuth(`${BASE_URL}/events/${eventId}/Gifts/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },
};
