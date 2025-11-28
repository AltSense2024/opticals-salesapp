import Doctor from "@/assets/SVG/Doctor";
import Logo from "@/assets/SVG/Logo";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/context/authContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        // justifyContent: "center",
        // alignItems: "center",
        // padding: 32,
      }}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-8 h-full justify-center">
        {/* Header */}
        <View className="items-center mb-6">
          <Logo />
          <Doctor />
          <Text className="text-xl font-semibold mt-2">Login Account</Text>
        </View>

        {/* Inputs */}
        <View className="pt-3 flex-col gap-2">
          <Input
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            label="Email"
          />

          <Input
            placeholder="Password"
            onChangeText={setPassword}
            secureTextEntry
            value={password}
            label="Password"
          />

          {/* Login Button */}
          <Button
            name={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;
