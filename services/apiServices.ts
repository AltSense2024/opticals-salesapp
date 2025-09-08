import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  // baseURL: "http://127.0.0.1:8000/",
  baseURL: "http://192.168.1.2:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("auth_token"); // ✅ await here
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      console.log("token", token);
      return config;
    } catch (error) {
      console.error("Error getting token:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export default api;
