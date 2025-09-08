import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import Poster from "@/assets/SVG/Poster";
import Input from "@/components/Input";
import Menu from "@/components/Menu";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import Poster from "../../assets/poster.svg";
import ContactLens from "../../assets/SVG/ContactLens.svg";
import PowerGlass from "../../assets/SVG/Powerglass.svg";
import Sunglass from "../../assets/SVG/Sunglass.svg";

const home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const menus = [
    {
      icon: <PowerGlass />,
      name: "Power Glass",
      onPress: () => router.push("/(tabs)/add_customer"),
    },
    {
      icon: <Sunglass />,
      name: "Sun Glass",
      onPress: () => console.log("first"),
    },

    {
      icon: <ContactLens />,
      name: "Contact Lens",
      onPress: () => console.log("first"),
    },
  ];
  return (
    <View className="h-full p-4">
      <View>
        <Text className="text-black font-bold text-2xl">
          Hello, {user?.username}
        </Text>
      </View>
      {/* <View className="my-2">
        <Input
          placeholder="Search"
          onChangeText={function (text: string): void {
            throw new Error("Function not implemented.");
          }}
          value={undefined}
          label={""}
        />
      </View> */}
      <View className="w-full py-4">
        <Poster width="100%" />
      </View>
      <View className="items-center">
        {menus.map((menu, index) => (
          <Menu
            key={index}
            icon={menu?.icon}
            name={menu?.name}
            onPress={menu?.onPress}
          />
        ))}
      </View>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({});
