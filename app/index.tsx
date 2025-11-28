// app/index.tsx
import { useAuth } from "@/context/authContext"; // your hook
import { Redirect } from "expo-router";

export default function Index() {
  const { user } = useAuth();
  if (user) return <Redirect href="/(tabs)/home" />;
  return <Redirect href="/login" />;
}
