import { useProductState } from "@/stores/OrderFormProductsStore";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AddproductForm from "./AddProductform";
import { initalValuesForCreate } from "./AddProductFormSchema";

const addproductpage = () => {
  const { addProduct, products, getProductById, editProduct } =
    useProductState();
  const router = useRouter();

  // const handleAddProduct = async (values: any) => {
  //   try {
  //     console.log("values", values);
  //     const alreadyExists = products.some(
  //       (p) => p.product_id == values.product_id
  //     );
  //     console.log("alreadyExists", alreadyExists);
  //     if (alreadyExists) {
  //       alert("This product is already added to the order.");
  //       return;
  //     }

  //     const add_product = addProduct(values);
  //     router.back();
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  const handleAddProduct = (values: any) => {
    try {
      if (!values.product_id) return;

      const existing = getProductById(values.product_id);
      console.log("existing", existing);

      if (existing) {
        const newQuantity = existing.quantity + (values.quantity || 1);

        editProduct({
          ...existing,
          quantity: newQuantity,
          discount_in_percentage:
            values.discount_in_percentage ?? existing.discount_in_percentage,
          discount_in_rupees:
            values.discount_in_rupees ?? existing.discount_in_rupees,
          total_amount: newQuantity * existing.price,
        });

        console.log("Updated existing product:", existing.productName);
      } else {
        // ✅ Add new product
        addProduct({
          ...values,
          quantity: values.quantity || 1,
          total_amount: (values.quantity || 1) * values.price,
        });
        console.log("Added new product:", values.productName);
      }
      router.back();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View className="p-8">
      <Text className="text-2xl font-bold text-primary my-2">
        {" "}
        Product Details
      </Text>
      <View className="border-2 border-primary p-5 rounded-2xl">
        <Text className="font-semibold text-xl my-2">Product Information </Text>
        <AddproductForm
          defaultValues={initalValuesForCreate}
          onSubmit={(values) => {
            const parsedValues = {
              ...values,
              quantity: Number(values.quantity) || 0,
              price: Number(values.price) || 0,
              discount_in_percentage:
                Number(values.discount_in_percentage) || 0,
              discount_in_rupees: Number(values.discount_in_rupees) || 0,
            };
            handleAddProduct(parsedValues);
          }}
          buttonName="Add Product"
        />
      </View>
    </View>
  );
};

export default addproductpage;

const styles = StyleSheet.create({});
