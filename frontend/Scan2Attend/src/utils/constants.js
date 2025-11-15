// export const backendUrl = location.hostname === 'localhost'? import.meta.env.VITE_BACKEND_URL : "https://scan2attend-backend.onrender.com";
// export const frontendUrl = location.hostname === 'localhost'? import.meta.env.VITE_FRONTEND_URL : "https://scan2attend.onrender.com";

export const backendUrl = location.hostname === "localhost"
  ? "http://localhost:3001/api"
  : "https://scan2attend-backend.onrender.com";

export const frontendUrl = location.hostname === "localhost"
  ? "http://localhost:5173"
  : "https://scan2attend.onrender.com";
