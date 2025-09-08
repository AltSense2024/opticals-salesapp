import Input from "@/components/Input";
import InvoiceCard from "@/components/InvoiceCard";
import invoice_service from "@/services/invoice_service";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

interface Invoice {
  id: string;
  date: string;
  doc_number: string;
  customer_id: string;
  total_amount: number;
  customer_name: string;
}

const InvoiceScreen = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getInvoices = async () => {
    try {
      const response = await invoice_service.get_all_invoices();
      if (response.status === 200) {
        setInvoices(response.data.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getInvoices();
    }, [])
  );

  // pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getInvoices();
    setRefreshing(false);
  }, []);

  return (
    <View className="p-8 flex-1">
      <Text className="font-extrabold text-[24px]">Order Copy History</Text>

      <Input
        label=""
        placeholder="Search"
        onChangeText={(text) => {
          // you can add search logic here
          console.log("Search text:", text);
        }}
        value={undefined}
        className="rounded-2xl my-2"
      />

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="py-2">
            <InvoiceCard
              invoiceNumber={item.doc_number}
              date={item.date}
              name={item.customer_name}
              amount={item.total_amount}
              id={item.id}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default InvoiceScreen;

const styles = StyleSheet.create({});
