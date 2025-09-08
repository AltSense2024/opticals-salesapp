import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import RightArrow from "../assets/SVG/RightArrow.svg";

interface MenuProps {
  icon: React.ReactNode;
  name: string;
  onPress: () => void;
}

const Menu: React.FC<MenuProps> = ({ icon, name, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[80%] p-3  items-center border border-primary mt-3 rounded-[15px] flex flex-row justify-between items-center"
    >
      {icon}
      <Text className="text-black font-bold text-[19px]"> {name}</Text>
      <RightArrow />
    </TouchableOpacity>
  );
};

export default Menu;

const styles = StyleSheet.create({});
