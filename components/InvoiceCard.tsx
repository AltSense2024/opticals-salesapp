import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface InvoiceCardProps {
  id: string;
  invoiceNumber: string;
  date: string;
  name: string;
  amount: number;
  status: string;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  id,
  invoiceNumber,
  amount,
  date,
  name,
  status,
}) => {
  return (
    <View className="bg-[#F8F8F8] p-5 flex-row justify-between items-center rounded-[20]">
      <View className="flex-[2]">
        <Text className="font-semibold mb-1 text-md">
          Invoice No : {invoiceNumber}
        </Text>
        <Text className="font-regular mb-1 text-md">{name}</Text>
        <Text className="mb-1 font-bold text-md">
          {moment(date).format("DD-MM-YYYY")}
        </Text>
        {status == "PAID" && <Text style={{color:"darkgreen"}}>{status}</Text>}
        {status == "PARTIAL" && <Text style={{color:"orange"}}>{status}</Text>}
        {status == "UNPAID" && <Text style={{color:"red"}}>{status}</Text>}
      </View>
      <View>
        <Text className="font-bold mb-1 text-center text-xl">Rs {amount}</Text>
        <TouchableOpacity
          className="border px-4 py-1 rounded-[50] border-primary mt-2"
          onPress={() =>
            useRouter().push({ pathname: "/order/[id]", params: { id: id } })
          }
        >
          <Text className="font-semibold text-primary">View Preview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InvoiceCard;

const styles = StyleSheet.create({});
