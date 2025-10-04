import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3000", // or 4000 if you changed it
  headers: { "Content-Type": "application/json" },
});

// attach token on every request
API.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// optional: redirect to /login on 401s
API.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const signup = (data:any) => API.post("/auth/signup", data);
export const login  = (data:any) => API.post("/auth/login", data);
