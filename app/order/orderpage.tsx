import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useAuth } from "@/context/authContext";
import invoice_service from "@/services/invoice_service";
import { useCustomerState } from "@/stores/CustomerStore";
import { useProductState } from "@/stores/OrderFormProductsStore";
import { usePrescriptionState } from "@/stores/PrescriptionStore";
import { HeaderBackButton } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import OrderForm from "./OrderForm";

const orderpage = () => {
  const { products, clearProducts } = useProductState();
  const { customer } = useCustomerState();
  const { prescriptionId } = usePrescriptionState();
  const { user } = useAuth();

  const handelSubmit = async (formValues: any) => {
    try {
      console.log("formValues", formValues);
      const values = {
        ...formValues,
        salesperson_id: user?.id,
        doc_type: "order",
      };
      const response = await invoice_service.create_invoice(values);
      if (response.status === 201) {
        useRouter().push({
          pathname: "/invoice/invoicepage",
          params: {
            url: "https://nfzrotftbjkcgmzochwq.supabase.co/storage/v1/object/sign/Invoices/invoice/INV-30082025-004.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZTkwNTEwMS1kMzkzLTQ5OTAtOGYwMy1mNDk5YWQ1NWVkOWQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbnZvaWNlcy9pbnZvaWNlL0lOVi0zMDA4MjAyNS0wMDQucGRmIiwiaWF0IjoxNzU2NTM3MTg0LCJleHAiOjE3NTY2MjM1ODR9.lyy7DEeHIC_tTOVZknzKnwSJ5TM4O7VDBv-ulhvcrMs",
          },
        });
        console.log("created");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <ScrollView className="p-8">
      {/* <Header title="Order" /> */}
      <HeaderBackButton
        onPress={() => {
          useRouter().back;
          clearProducts();
        }}
      />

      <View className="border-2 border-primary p-6  rounded-2xl">
        <OrderForm
          initialValues={{ products: products }}
          buttonName="Generate Order Copy"
          onSubmit={(values) => handelSubmit(values)}
        />
      </View>
    </ScrollView>
  );
};

export default orderpage;

const styles = StyleSheet.create({});
