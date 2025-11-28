import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { primary } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AddCustomer from "../../assets/SVG/Bottombar/AddCustomer.svg";
import Home from "../../assets/SVG/Bottombar/Home.svg";
import Invoice from "../../assets/SVG/Bottombar/Invoice.svg";
import ViewProduct from "../../assets/SVG/Bottombar/ViewProduct.svg";
import "../../global.css";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: "#999",
        headerShown: false,

        // tabBarActiveBackgroundColor: "red",

        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <Home width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="add_customer"
        options={{
          title: "Add Customer",
          tabBarIcon: ({ focused }) => (
            <AddCustomer
              width={24}
              height={24}
              color={focused ? "primary" : "#999"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="view_product"
        options={{
          title: "View Product",
          tabBarIcon: ({ focused }) => (
            <ViewProduct
              width={24}
              height={24}
              color={focused ? "primary" : "#999"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="invoice"
        options={{
          title: "Invoice",
          tabBarIcon: ({ focused }) => (
            <Invoice
              width={24}
              height={24}
              color={focused ? "primary" : "#999"}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        // name="settings"
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SettingsFill width={24} height={24} />
            ) : (
              <Settings
                width={24}
                height={24}
                color={focused ? "primary" : "#999"}
              />
            ),
        }}
      /> */}
    </Tabs>
  );
}
