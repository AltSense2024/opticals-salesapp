import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface InputProps {
  label: string;
  placeholder: string;
  onChangeText: (text: any) => void;
  secureTextEntry?: boolean;
  value: any;
  className?: string;
  editable?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  onChangeText,
  secureTextEntry = false,
  className,
  value,
  editable = true,
}) => {
  return (
    <View className={` ${className || ""}`}>
      <Text className="mb-1 text-lg font-semibold">{label}</Text>
      <TextInput
        className="border-2 border-primary p-3 rounded-2xl text-black"
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor="grey"
        secureTextEntry={secureTextEntry}
        value={value}
        editable={editable}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({});
