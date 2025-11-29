import Doctor from "@/assets/SVG/Doctor";
import Logo from "@/assets/SVG/Logo";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/context/authContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ionicons from "@expo/vector-icons/Ionicons";

import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLocalLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Invalid Credentials");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
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
            label="Email"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password with Show/Hide */}
          <View>
            <Input
              placeholder="Password"
              label="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <View className="absolute right-3 top-10">
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>
          </View>

          <Button
            name={localLoading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            // disabled={localLoading}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;
