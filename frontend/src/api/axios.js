import axios from "axios";

export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_BASE}/api`
});

export default API;