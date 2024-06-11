import axios from "axios";

const axiosExpressInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_EXPRESS,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosExpressInstance;
