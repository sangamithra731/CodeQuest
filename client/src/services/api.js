import axios from "axios";

const BASE_URL = "http://localhost:5050";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cq_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor (refresh token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/api/auth/refresh");

        const token = res.data.accessToken;

        localStorage.setItem("cq_access_token", token);

        if (res.data.user) {
          localStorage.setItem(
            "cq_user",
            JSON.stringify(res.data.user)
          );
        }

        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("cq_access_token");
        localStorage.removeItem("cq_user");

        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// --------------------
// Authentication
// --------------------

export async function signup({ name, email, password }) {
  const res = await api.post("/api/auth/signup", {
    name,
    email,
    password,
  });

  localStorage.setItem("cq_access_token", res.data.accessToken);
  localStorage.setItem("cq_user", JSON.stringify(res.data.user));

  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post("/api/auth/login", {
    email,
    password,
  });

  localStorage.setItem("cq_access_token", res.data.accessToken);
  localStorage.setItem("cq_user", JSON.stringify(res.data.user));

  return res.data;
}

export async function logout() {
  await api.post("/api/auth/logout");

  localStorage.removeItem("cq_access_token");
  localStorage.removeItem("cq_user");
}

// --------------------
// Dashboard
// --------------------

export async function getDashboard() {
  try {
    const res = await api.get("/api/users/me/dashboard");
    return res.data;
  } catch {
    return {
      level: 1,
      xp: 0,
      xpIntoLevel: 0,
      xpForNextLevel: 100,
      streak: 0,
      badges: [],
      certificates: [],
      courseProgress: {},
    };
  }
}

// --------------------
// Progress
// --------------------

export async function getLanguageProgress(languageSlug) {
  const res = await api.get(
    `/api/progress/languages/${languageSlug}`
  );

  return res.data.language;
}

export async function getLevelById(levelId) {
  const res = await api.get(
    `/api/progress/levels/${levelId}`
  );

  return res.data.level;
}

export async function getModule(languageSlug, moduleSlug) {
  const language = await getLanguageProgress(languageSlug);

  const module = language.modules.find(
    (m) => m.slug === moduleSlug
  );

  if (!module) {
    throw new Error("Module not found");
  }

  const levels = await Promise.all(
    module.levels.map((level) =>
      getLevelById(level.id)
    )
  );

  return {
    id: module.id,
    slug: module.slug,
    title: module.title,
    language: language.name,
    levels,
  };
}

export async function submitLevel(levelId, data) {
  const res = await api.post(
    `/api/progress/levels/${levelId}/submit`,
    data
  );

  return res.data.result;
}

// --------------------
// Leaderboard
// --------------------

export async function getLeaderboard(range = "week") {
  try {
    const res = await api.get("/api/leaderboard", {
      params: { range },
    });

    return res.data;
  } catch {
    return [];
  }
}

// --------------------
// User Profile
// --------------------

export async function getUserProfile() {
  try {
    const res = await api.get("/api/users/me");
    return res.data;
  } catch {
    const user = JSON.parse(localStorage.getItem("cq_user") || "{}");

    return {
      id: user.id || user._id,
      name: user.name || user.username || "Coder",
      username: user.username || user.name || "Coder",
      email: user.email || "",
      level: user.level || 1,
      xp: user.xp || 0,
      streak: user.streak || 0,
    };
  }
}

// --------------------
// Achievements
// --------------------

export async function getAchievements() {
  try {
    const res = await api.get("/api/users/me/achievements");
    return res.data;
  } catch {
    return {
      achievements: [],
      user: { level: 1 },
    };
  }
}

// --------------------
// Summary
// --------------------

export async function getSummary() {
  const res = await api.get("/api/progress/summary");
  return res.data;
}

// --------------------
// Exam
// --------------------

export async function getExam(levelId) {
  const res = await api.get(`/api/progress/exam/${levelId}`);
  return res.data;
}

export async function submitExam(levelId, answers) {
  const res = await api.post(
    `/api/progress/exam/${levelId}/submit`,
    { answers }
  );

  return res.data;
}
// --------------------
// Settings
// --------------------

export async function updateProfile({ username, email, bio }) {
  const res = await api.patch("/api/users/me", { username, email, bio });
  return res.data;
}

export async function updateNotificationSettings(notifications) {
  const res = await api.patch("/api/users/me/notifications", { notifications });
  return res.data;
}

export async function changePassword({ currentPassword, newPassword }) {
  const res = await api.post("/api/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
}

export async function deleteAccount() {
  const res = await api.delete("/api/users/me");
  return res.data;
}

export async function exportUserData() {
  const res = await api.get("/api/users/me/export", { responseType: "blob" });
  return res.data;
}

export default api;