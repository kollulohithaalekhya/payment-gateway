const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/api/v1"
    : "http://gateway_api:8000/api/v1";

const API_KEY = "key_test_abc123";
const API_SECRET = "secret_test_xyz789";

export async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
      "X-Api-Secret": API_SECRET,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.description || "API error");
  }

  return res.json();
}

export const getDashboardStats = () =>
  apiFetch("/dashboard/stats");

export const getTransactions = () =>
  apiFetch("/dashboard/transactions");
