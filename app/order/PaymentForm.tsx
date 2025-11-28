import DataDropDown from "@/components/DataDropDown";
import Input from "@/components/Input";
import React, { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

export interface PaymentFormValues {
  advance_amount: number;
  payment_mode: string;
  isPaymentReceived: boolean;
  balance_amount: number;
}

interface PaymentFormProps {
  initialValues: Partial<PaymentFormValues>;
}

const paymentModes = [
  { id: 1, name: "Gpay" },
  { id: 2, name: "Card" },
  { id: 3, name: "Cash" },
];

const PaymentForm = forwardRef((props: PaymentFormProps, ref) => {
  const { initialValues } = props;

  const { control, handleSubmit, setValue, watch } = useForm<PaymentFormValues>(
    {
      defaultValues: {
        advance_amount: 0,
        payment_mode: "",
        isPaymentReceived: false,
        ...initialValues,
      },
    }
  );

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      let formData;
      await handleSubmit((data) => {
        formData = data;
      })();
      return formData;
    },
  }));

  return (
    <View>
      <Controller
        control={control}
        name="advance_amount"
        render={({ field }) => (
          <Input
            label="Advance Paid"
            placeholder="Advance Paid"
            value={String(field.value)}
            onChangeText={(val) => field.onChange(Number(val) || 0)}
          />
        )}
      />
      <Controller
        control={control}
        name="balance_amount"
        render={({ field }) => (
          <Input
            label="Balance Amount"
            placeholder="Balance Amount"
            value={String(field.value)}
            onChangeText={(val) => field.onChange(Number(val) || 0)}
          />
        )}
      />
      <DataDropDown
        data={paymentModes}
        label="Payment Mode"
        value={watch("payment_mode")}
        onSelect={(id) => {
          const mode = paymentModes.find((m) => m.id == Number(id));
          if (mode) setValue("payment_mode", mode.name);
        }}
      />
      {/* <Controller
        control={control}
        name="isPaymentReceived"
        render={({ field }) => (
          <Input
            label="Payment Received?"
            placeholder="true/false"
            value={field.value ? "Yes" : "No"}
            editable={false}
            onChangeText={function (text: any): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      /> */}
    </View>
  );
});

export default PaymentForm;
