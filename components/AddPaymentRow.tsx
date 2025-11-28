import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import DataDropDown from "./DataDropDown";
import Input from "./Input";

interface AddPaymentRowProps {
  control: any;
  index: number;
  setValue: any;
  
}
const paymentModes = [
  { id: "gpay", name: "GPay" },
  { id: "card", name: "Card" },
  { id: "cash", name: "Cash" },
];

const AddPaymentRow: React.FC<AddPaymentRowProps> = ({
  control,
  index,
  setValue,

}) => {
  return (
    <View>
      <Text> Payment {index + 1}</Text>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Amount Paid"
            placeholder="Amount Paid"
            onChangeText={(val) => onChange(Number(val) || 0)}
            value={String(value ?? 0)}
          />
        )}
        name={`payments.${index}.amount_paid`}
      />
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <DataDropDown
            data={paymentModes}
            label="Mode of Payment"
            value={value}
            onSelect={(id: string) => {
              const findMode = paymentModes.find((p) => p.id === id);
              if (findMode) {
                setValue(`payments.${index}.payment_mode`, findMode.name);
              }
            }}
          />
        )}
        name={`payments.${index}.payment_mode`}
      />
    </View>
  );
};

export default AddPaymentRow;

const styles = StyleSheet.create({});
