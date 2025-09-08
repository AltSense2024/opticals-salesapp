import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomerForm from "./CustomerForm";

const id = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const defaultValues = {
    mcn_number: "sample",
    customer_name: "sadf",
    phone_number: "2323122",
    place: "erw",
    age: "23",
    address: "rw",
    reference: "er",
    family: "er",
  };

  return (
    <View className="p-4" style={{ flex: 1 }}>
      <Text className="text-2xl font-bold">Hello, Sales Id</Text>
      <Text className="text-[15px] font-light pt-2">
        Right Product For Right Customer
      </Text>
      <View
        className="mt-5 border border-primary p-5 rounded-2xl"
        style={{ elevation: 4 }}
      >
        <Text className="text-primary font-bold pb-2 text-xl">
          Customer Data Entry Form
        </Text>
        <CustomerForm
          initialValues={defaultValues}
          buttonName="Edit Customer"
          onSubmit={() => console.log("first")}
        />
      </View>
    </View>
  );
};

export default id;

const styles = StyleSheet.create({});
