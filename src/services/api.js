import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://whats-next-tbr-fastapi.onrender.com/books",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
