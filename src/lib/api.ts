import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // important for JWT cookies later
});

export default api;