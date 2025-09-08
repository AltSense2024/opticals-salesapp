import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ButtonProps {
  name: string;
  disable?: boolean;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ name, onPress, disable = false }) => {
  return (
    <View className="mt-3">
      <TouchableOpacity
        onPress={onPress}
        disabled={disable}
        className="items-center border border-primary bg-primary rounded-2xl p-3"
      >
        <Text className="text-white font-semibold">{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({});
