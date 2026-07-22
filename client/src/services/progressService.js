import api from "./api";

export async function fetchCatalog() {
  const { data } = await api.get("/api/progress/catalog");
  return data.languages;
}

export async function fetchLanguageProgress(slug) {
  const { data } = await api.get(`/api/progress/languages/${slug}`);
  return data.language;
}

export async function fetchLevel(levelId) {
  const { data } = await api.get(`/api/progress/levels/${levelId}`);
  return data.level;
}

export async function fetchSummary() {
  const { data } = await api.get("/api/progress/summary");
  return data.summary;
}

export async function submitLevel(levelId, { code, passed }) {
  const { data } = await api.post(`/api/progress/levels/${levelId}/submit`, {
    code,
    passed,
  });
  return data;
}