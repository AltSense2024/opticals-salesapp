// import CustomHeader from "@/components/Header";
// import Input from "@/components/Input";
// import ProductCard from "@/components/ProductCard";
// import { useProductContext } from "@/context/ProductContext";
// import { useFocusEffect } from "expo-router";

// import React, { useCallback, useEffect, useState } from "react";
// import { FlatList, StyleSheet, Text, View } from "react-native";

// const view_product = () => {
//   const [search, setSearch] = useState("");
//   const { products, fetchProducts } = useProductContext();

//   console.log("products", products);
//   useFocusEffect(
//     useCallback(() => {
//       const fetchData = async () => {
//         await fetchProducts();
//       };
//       fetchData();
//     }, [])
//   );

//   return (
//     <View className="p-8 flex-[1]">
//       <CustomHeader title={""} />
//       <Text className="font-extrabold text-[24px] text-primary text-center">
//         {" "}
//         Products
//       </Text>

//       <Input
//         label={""}
//         placeholder="Search"
//         onChangeText={function (text: any): void {
//           throw new Error("Function not implemented.");
//         }}
//         value={undefined}
//         className="rounded-2xl my-2"
//       ></Input>
//       {search.length != 0 && (
//         <Text className="font-semibold text-[24px]">
//           Search Results : {search}
//         </Text>
//       )}
//       <FlatList
//         data={products}
//         keyExtractor={(item, index) => index.toString()} // or item.id if available
//         renderItem={({ item }) => (
//           <ProductCard
//             specsName={item.name}
//             price={item.price}
//             discountPrice={item.price ?? 0}
//             imageurl={item.imageUrl}
//             quantity={item.stock}
//           />
//         )}
//       />

//       {/* {products.map((product, index) => (
//         <View key={index}></View>
//       ))} */}
//     </View>
//   );
// };

// export default view_product;

// const styles = StyleSheet.create({});
import CustomHeader from "@/components/Header";
import Input from "@/components/Input";
import ProductCard from "@/components/ProductCard";
import { useProductContext } from "@/context/ProductContext";
import { useFocusEffect } from "expo-router";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

const ViewProduct = () => {
  const [search, setSearch] = useState("");
  const {
    products,
    fetchProducts,
    fetchMoreProducts,
    loading,
    loadingMore,
    hasMore,
    resetProducts,
  } = useProductContext();

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // on focus load first page
      resetProducts();
      void fetchProducts({ page: 1, limit: 5, q: "", replace: true });
    }, [fetchProducts, resetProducts])
  );

  // debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      resetProducts();
      void fetchProducts({ page: 1, limit: 5, q: search, replace: true });
    }, 500);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, fetchProducts, resetProducts]);

  const onRefresh = async () => {
    setRefreshing(true);
    resetProducts();
    await fetchProducts({ page: 1, limit: 5, q: search, replace: true });
    setRefreshing(false);
  };

  const loadMore = () => {
    if (loadingMore || loading) return;
    if (!hasMore) return;
    void fetchMoreProducts(search);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 12 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const ListEmpty = () => {
    if (loading) {
      return (
        <View style={{ padding: 24 }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#666" }}>No products found</Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.inner}>
        <CustomHeader title={""} />
        <Text style={styles.title}>Products</Text>

        <Input
          label={""}
          placeholder="Search"
          onChangeText={(text) => setSearch(text)}
          value={search}
          className="rounded-2xl my-2"
        />

        <FlatList
          data={products}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          renderItem={({ item }) => (
            <ProductCard
              specsName={item.name}
              price={item.price}
              discountPrice={item.discountPrice ?? item.price ?? 0}
              imageurl={item.imageUrl}
              quantity={item.stock}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={ListEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

export default ViewProduct;

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  inner: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#491B6D",
    marginBottom: 8,
    textAlign: "center",
  },
});
