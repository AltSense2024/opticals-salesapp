import api from "@/services/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

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
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // ------------------------------------------
  // LOAD AUTH STATE ON APP START
  // ------------------------------------------
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("auth_user");
        const storedToken = await AsyncStorage.getItem("access_token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Failed to load auth state:", e);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // ------------------------------------------
  // LOGIN
  // ------------------------------------------
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("auth/login", { email, password });

      // Build user from returned flat JSON
      const loggedInUser: User = {
        id: res.data.id,
        email: res.data.email,
        username: res.data.username,
        role: res.data.role,
      };

      const accessToken = res.data.access_token;

      // Save to storage
      await AsyncStorage.setItem("auth_user", JSON.stringify(loggedInUser));
      await AsyncStorage.setItem("access_token", accessToken);
      await AsyncStorage.setItem("refresh_token", res.data.refresh_token || "");

      // Update state
      setUser(loggedInUser);
      setToken(accessToken);

      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.log("LOGIN ERROR:", err);
      throw new Error("Invalid credentials");
    }
  };

  // ------------------------------------------
  // LOGOUT
  // ------------------------------------------
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("auth_user");
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("refresh_token");

      setUser(null);
      setToken(null);

      router.replace("/login");
    } catch (e) {
      console.error("Failed to logout:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
