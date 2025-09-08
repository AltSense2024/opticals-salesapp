import Input from "@/components/Input";
import ProductCard from "@/components/ProductCard";
import { useProductContext } from "@/context/ProductContext";

import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const view_product = () => {
  const [search, setSearch] = useState("");
  const { products, fetchProducts } = useProductContext();

  console.log("products", products);

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, []);

  return (
    <View className="p-8 flex-[1]">
      <Text className="font-extrabold text-[24px]"> Products</Text>

      <Input
        label={""}
        placeholder="Search"
        onChangeText={function (text: any): void {
          throw new Error("Function not implemented.");
        }}
        value={undefined}
        className="rounded-2xl my-2"
      ></Input>
      {search.length != 0 && (
        <Text className="font-semibold text-[24px]">
          Search Results : {search}
        </Text>
      )}
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()} // or item.id if available
        renderItem={({ item }) => (
          <ProductCard
            specsName={item.name}
            price={item.price}
            discountPrice={item.price ?? 0}
            imageurl={item.imageUrl}
            quantity={item.stock}
          />
        )}
      />

      {/* {products.map((product, index) => (
        <View key={index}></View>
      ))} */}
    </View>
  );
};

export default view_product;

const styles = StyleSheet.create({});
