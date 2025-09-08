import { Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CustomHeaderProps {
  title: string;
  rightButton?: {
    iconName: string;
    onPress: () => void;
  };
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, rightButton }) => {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        // paddingHorizontal: 16,

        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      {/* Back Button */}
      <HeaderBackButton
        onPress={() => router.back()}
        tintColor="#491B6D"
        // labelVisible={false}
      />

      {/* Title */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#333",
          flex: 1,
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      {/* Right Action Button */}
      {rightButton ? (
        <TouchableOpacity onPress={rightButton.onPress}>
          <Ionicons
            name={rightButton.iconName as any}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} /> // placeholder for spacing
      )}
    </View>
  );
};

export default CustomHeader;
