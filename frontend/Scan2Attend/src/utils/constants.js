export const backendUrl = location.hostname === "localhost"
  ? "http://localhost:3001/api"
  : "https://scan2attend-backend.onrender.com/api";

export const frontendUrl = location.hostname === "localhost"
  ? "http://localhost:5173"
  : "https://scan2attend.onrender.com";
