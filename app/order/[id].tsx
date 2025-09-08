import CustomHeader from "@/components/Header";
import { useAuth } from "@/context/authContext";
import invoice_service from "@/services/invoice_service";
import { useCustomerState } from "@/stores/CustomerStore";
import { useProductState } from "@/stores/OrderFormProductsStore";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OrderForm, { OrderFormValues } from "./OrderForm";

const OrderPageId = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addProduct, products, setProducts } = useProductState();
  const [prescriptionID, setPrescriptionId] = useState("");
  const { user } = useAuth();
  const { addCustomer } = useCustomerState();
  const [initialValues, setInitialValues] = useState<Partial<OrderFormValues>>({
    // customerName: "",
    // contactNumber: "",
    products: [],
    // flat_discount: 0,
    advance_amount: 0,
    total_amount: 0,
    payment_mode: "",
  });

  const get_invoice_by_id = async (id: string) => {
    try {
      const response = await invoice_service.get_invoice_by_id(id);
      if (response.status === 200) {
        const invoiceData = response.data.data;
        const mappedProducts = invoiceData.items.map((item: any) => ({
          product_id: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          discount_in_percentage: item.discount_in_percentage,
          discount_in_rupees: item.discount_in_rupees,
          total_amount: item.total_amount,
        }));

        setProducts(mappedProducts);
        addCustomer(invoiceData.customer);
        setInitialValues({
          customer_id: invoiceData.customer.id,

          discount_in_rupees: invoiceData.discount_in_rupees || 0,
          discount_in_percentage: invoiceData.discount_in_percentage || 0,
          advance_amount: invoiceData.advance_amount || 0,
          // total_amount: invoiceData.total_amount || 0,
          payment_mode: invoiceData.payment_mode || "",
        });
        setPrescriptionId(invoiceData.customer.prescriptions.id);
      }
    } catch (error) {
      console.error("something went wrong", error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formValues = {
        ...values,
        salesperson_id: user?.id,
      };
     
      const response = await invoice_service.update_invoice(id, formValues);
     
      if (response.status == 200) {
        useRouter().push({
          pathname: "/invoice/invoicepage",
          params: {
            url: response.data.invoice_url,
          },
        });
      }
    } catch (error) {
      Alert.alert("Error");
    }
  };

  useEffect(() => {
    if (id) {
      get_invoice_by_id(id);
    }
  }, [id]);

  return (
    <ScrollView className="p-8">
      <CustomHeader title="Order Form" />
      <View className="border-2 border-primary p-6 rounded-2xl">
        <OrderForm
          initialValues={{ ...initialValues, products: products }}
          buttonName="update Order Copy"
          onSubmit={(values) => handleSubmit(values)}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/prescription/[id]",
            params: { id: prescriptionID },
          });
        }}
      >
        <Text> Edit Prescription {prescriptionID || ""}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrderPageId;

const styles = StyleSheet.create({});
