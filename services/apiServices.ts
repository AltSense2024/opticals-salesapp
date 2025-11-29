import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

const url = "http://10.0.2.2:8000/";
// const url = "https://opticals-backend-d24g.onrender.com/";
const api = axios.create({
  // baseURL: "http://127.0.0.1:8000/",
  // baseURL: "http://192.168.0.4:8000/",
  baseURL: url,
  // baseURL: "http://10.0.2.2:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("access_token"); // ✅ await here
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

// Response interceptor

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status == 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }
        isRefreshing = true;
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh Token available");

        const refreshResponse = await axios.post(
          // "http://192.168.0.4:8000/auth/refresh_token",
          // "http://10.0.2.2:8000/auth/refresh_token",
          `${url}auth/refresh_token?refresh_token=${refreshToken}`,
          // { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        const newAccessToken = refreshResponse.data.access_token;
        const newRefreshToken = refreshResponse.data.refresh_token;

        // Save new tokens
        await AsyncStorage.setItem("access_token", newAccessToken);
        console.log("new token",newAccessToken);
        await AsyncStorage.setItem("refresh_token", newRefreshToken);

        // Update axios default header
        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
