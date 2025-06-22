import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9012",
  withCredentials: true,
});

export default axiosInstance;