import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";
import customer_services from "@/services/customer_services";
import { useCustomerState } from "@/stores/CustomerStore";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomerForm from "../customer/CustomerForm";

const AddCustomer = () => {
  const { addCustomer, customer } = useCustomerState();
  const { user } = useAuth();

  const create_customer = async (values: any) => {
    try {
      console.log("checking");
      const formValues = { ...values, salesperson_id: user?.id };
      const response = await customer_services.create_customer(formValues);
      if (response.status === 201) {
        console.log("response.data", response.data);
        addCustomer(response.data.customer_details);
        console.log("customer in addcustomer", customer);
        useRouter().push("/prescription/prescription");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <ScrollView className="p-8">
      <Text className="text-2xl font-bold">Hello, {user?.username}</Text>
      <Text className="text-[15px] font-light pt-2">
        Right Product For Right Customer
      </Text>
      <View className="mt-5 border-2 border-primary p-3 rounded-2xl">
        <Text className="text-primary font-bold pb-2 text-xl">
          Customer Data Entry Form
        </Text>
        <CustomerForm
          buttonName="Add Customer"
          onSubmit={(values) => create_customer(values)}
        />
      </View>
      <Button
        name="Go to Bill Page"
        onPress={() => useRouter().push("/invoice/invoicepage")}
      />
    </ScrollView>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({});
