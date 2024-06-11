import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://api.renospace.hk/api/v1",
  baseUrl: "https://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
