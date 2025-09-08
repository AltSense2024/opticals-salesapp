import { useProductState } from "@/stores/OrderFormProductsStore";
import { HeaderBackButton } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AddproductForm from "./AddProductform";

const addproductpage = () => {
  const { products, getProductById, editProduct } = useProductState();
  const { id } = useLocalSearchParams<{ id: string }>();

  const productById = id ? getProductById(id) : null;

  console.log("productById", productById);

  const handleSubmit = (values: any) => {
    try {
      console.log("values in edit page", values);
      const addEditedProduct = editProduct(values);
      useRouter().back();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View className="p-8">
      <HeaderBackButton onPress={() => useRouter().back()} />
      <Text className="text-2xl font-bold text-primary my-2">
        Product Details
      </Text>
      <View className="border-2 border-primary p-5 rounded-2xl">
        <Text className="font-semibold text-xl my-2">Product Information </Text>
        <AddproductForm
          defaultValues={{
            product_id: productById?.product_id ?? "",
            productName: productById?.productName ?? "",
            quantity: Number(productById?.quantity) ?? 0,
            price: Number(productById?.price) ?? 0,
            discount_in_percentage: Number(
              productById?.discount_in_percentage ?? 0
            ),
            // discount_in_rupees: Number(productById?.discount_in_rupees ?? 0),
          }}
          onSubmit={(values) => {
            console.log("values in addproduct", values);
            handleSubmit(values);
          }}
          buttonName="Edit Product"
        />
      </View>
    </View>
  );
};

export default addproductpage;

const styles = StyleSheet.create({});
