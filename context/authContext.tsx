import api from "@/services/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const user = await api.post("auth/login", { email, password });
      if (user) {
        const loggedInUser: User = user.data;
        const token: string = user.data.access_token;
        await AsyncStorage.setItem("auth-user", JSON.stringify(user.data));
        await AsyncStorage.setItem("auth_token", token);
        await AsyncStorage.setItem("refresh_token", user.data.refresh_token);
        setUser(loggedInUser);
        setToken(token);
        const get_token = await AsyncStorage.getItem("auth_token");
        console.log("token", get_token);
        useRouter().replace("/(tabs)/home");
        console.log("User", user.data.access_token);
      }
    } catch (e) {
      console.error("Failed to save auth state:", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("auth-user");
      await AsyncStorage.removeItem("auth-token");
      setUser(null);
      setToken(null);
    } catch (e) {
      console.error("Failed to clear auth state:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
