import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import DataDropDown from "@/components/DataDropDown";
import Input from "@/components/Input";
import OrderProductCard from "@/components/OrderProductCard";

import AddPaymentRow from "@/components/AddPaymentRow";
import { useCustomerState } from "@/stores/CustomerStore";
import { useProductState } from "@/stores/OrderFormProductsStore";
import DatePicker from "@/components/CustomDateTime";

// ---------------- Types ----------------
export interface OrderFormValues {
  customer_id: string;
  products: {
    product_id: string;
    productName: string;
    price: number;
    imageUrl?: string;
    quantity: number;
    total_amount?: number;
    discount_in_percentage?: number;
    discount_in_rupees?: number;
  }[];
  advance_amount: number;
  discount_in_percentage: number;
  discount_in_rupees: number;
  total_amount: number;
  final_amount: number;
  balance_amount: number;
  estimate_delivery_date: Date;
  // payment_mode: string;
  payments: {
    amount_paid: number;
    payment_mode: string;
  }[];
}

interface OrderFormProps {
  initialValues: Partial<OrderFormValues>;
  buttonName: string;
  onSubmit: (values: OrderFormValues) => void;
}

// ---------------- Constants ----------------
const GST_RATE = 12; // in percent

const paymentModes = [
  { id: "gpay", name: "GPay" },
  { id: "card", name: "Card" },
  { id: "cash", name: "Cash" },
];

const paymentStatus = [
  { id: "paid", name: "PAID" },
  { id: "not_paid", name: "UNPAID" },
  { id: "PARTIAL", name: "PARTIAL" },
];

// ---------------- Helpers ----------------
export const round2 = (n: number) =>
  Number((Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2));

const calcSubtotal = (products: OrderFormValues["products"]) =>
  products.reduce((sum, p) => {
    const price = Number(p.price) || 0;
    const qty = Number(p.quantity) || 0;
    const base = price * qty;
    const discount = Number(p.discount_in_rupees) || 0;
    const afterDiscount = base - discount;
    const gstAmount = afterDiscount * (GST_RATE / 100);
    return sum + afterDiscount + gstAmount;
  }, 0);

// ---------------- Component ----------------
const OrderForm: React.FC<OrderFormProps> = ({
  initialValues,
  buttonName,
  onSubmit,
}) => {
  const router = useRouter();
  const { fetchCustomers, customers, customer, addCustomer } =
    useCustomerState();
  const { deleteProduct } = useProductState();

  const [lastEdited, setLastEdited] = useState<"percent" | "rupees" | null>(
    null
  );
  const hydratedOnceRef = useRef(false);
  const { clearProducts } = useProductState();
  const { control, handleSubmit, reset, setValue, watch } =
    useForm<OrderFormValues>({
      defaultValues: {
        customer_id: customer?.id ?? "",
        products: [],
        discount_in_percentage: 0,
        discount_in_rupees: 0,
        advance_amount: 0,
        total_amount: 0,
        final_amount: 0,
        balance_amount: 0,
        estimate_delivery_date: new Date(),
        // payment_mode: "",
        // payment_status: "UNPAID",
        payments: [],
        ...initialValues,
      },
    });

  // Reinitialize when props or customer change
  useEffect(() => {
    reset({
      customer_id: customer?.id ?? "",
      products: [],
      discount_in_percentage: 0,
      discount_in_rupees: 0,
      advance_amount: 0,
      total_amount: 0,
      final_amount: 0,
      balance_amount: 0,
      estimate_delivery_date: new Date(),
      // payment_mode: "",
      // payment_status: "",
      payments: [],
      ...initialValues,
    });
  }, [initialValues, customer, reset]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Watch values
  const products = useWatch({ control, name: "products" }) || [];
  const discountPercent = useWatch({ control, name: "discount_in_percentage" });
  const discountRupees = useWatch({ control, name: "discount_in_rupees" });
  const advance = useWatch({ control, name: "advance_amount" });
  // const paymentstatus = useWatch({ control, name: "payment_status" });
  const payments = useWatch({ control, name: "payments" }) || [];

  // addpayment
  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  });

  // Hydrate discounts when invoice loads
  useEffect(() => {
    if (hydratedOnceRef.current) return;

    const subtotal = calcSubtotal(products);
    const dPct = Number(discountPercent) || 0;
    const dAmt = Number(discountRupees) || 0;

    if (subtotal > 0 && dPct > 0 && dAmt === 0) {
      const rupees = (dPct / 100) * subtotal;
      setValue("discount_in_rupees", round2(rupees));
      setLastEdited("percent");
    }

    if (subtotal > 0 && dAmt > 0 && dPct === 0) {
      const pct = (dAmt / subtotal) * 100;
      setValue("discount_in_percentage", round2(pct));
      setLastEdited("rupees");
    }

    hydratedOnceRef.current = true;
  }, [products, discountPercent, discountRupees, setValue]);

  // Recalculate totals
  useEffect(() => {
    const subtotal = calcSubtotal(products);

    const advance_amount = payments.reduce(
      (sum, p) => sum + Number(p.amount_paid || 0),
      0
    );
    console.log("advance_amount", advance_amount);

    let newDiscountRupees = Number(discountRupees) || 0;
    let newDiscountPercent = Number(discountPercent) || 0;

    if (lastEdited === "percent") {
      newDiscountRupees = (newDiscountPercent / 100) * subtotal;
      setValue("discount_in_rupees", round2(newDiscountRupees));
    } else if (lastEdited === "rupees") {
      newDiscountPercent =
        subtotal > 0 ? (newDiscountRupees / subtotal) * 100 : 0;
      setValue("discount_in_percentage", round2(newDiscountPercent));
    }

    const total = subtotal - newDiscountRupees;
    console.log("subtotal,total", subtotal, total);
    const balanceAmount = total - advance_amount;
    setValue("total_amount", subtotal);
    setValue("final_amount", round2(total));
    setValue("balance_amount", balanceAmount);
  }, [
    products,
    discountPercent,
    discountRupees,
    advance,
    lastEdited,
    setValue,
    payments,
  ]);

  // ---------------- Render ----------------
  return (
    <ScrollView style={styles.container}>
      {/* Customer Selection */}
      {/* <DataDropDown
        data={customers}
        label="Customer Name"
        value={customer?.id ?? ""}
        onSelect={(id: string) => {
          const selectedCustomer = customers.find((c) => c.id == id);
          if (!selectedCustomer) return;
          addCustomer(selectedCustomer);
          setValue("customer_id", selectedCustomer.id);
        }}
      /> */}
      <DataDropDown
        label="Customer"
        value={customer?.name ?? ""}
        onSelect={(id) => {
          const sel = customers.find((c) => String(c.id) === String(id));
          if (sel) {
            addCustomer(sel);
            setValue("customer_id", sel.id);
          } else {
            // fallback: just set id
            setValue("customer_id", String(id));
          }
        }}
        loadPage={async (page, q, pageSize) => {
          await fetchCustomers({
            page,
            limit: pageSize,
            q,
            replace: page === 1,
          });
          // return items + optional meta from store
          return {
            items: (useCustomerState.getState().customers ?? []).slice(
              (page - 1) * pageSize,
              page * pageSize
            ),
          };
        }}
      />

      <Controller
        control={control}
        name="customer_id"
        render={({ field }) => (
          <Input
            label="Contact Number"
            placeholder="Contact Number"
            onChangeText={field.onChange}
            value={customer?.contact_number}
          />
        )}
      />

      {/* Products */}
      <View>
        {products.map((product, index) => (
          <OrderProductCard
            key={index}
            specsName={product.productName}
            total_amount={product.total_amount}
            price={product.price}
            imageurl={product.imageUrl}
            quantity={product.quantity}
            discount={product.discount_in_percentage}
            index={index}
            setFieldValue={(field, value) => {
              const updated = [...products];
              updated[index] = { ...updated[index], [field]: value };
              setValue("products", updated);
            }}
            deleteProduct={() => deleteProduct(product.product_id)}
            onPress={() =>
              router.push({
                pathname: "/addproduct/[id]",
                params: { id: product.product_id },
              })
            }
            id={product.product_id}
            onChangeQuantity={(newQty) => {
              const newTotal = product.price * newQty;
              const updated = [...products];
              updated[index] = {
                ...updated[index],
                quantity: newQty,
                total_amount: newTotal,
              };
              setValue("products", updated);
            }}
          />
        ))}
      </View>

      {/* Add Product */}
      <View className="items-center my-2">
        <View className="w-[50%]">
          <Button
            name="Add Product"
            onPress={() => router.push("/addproduct/addproductpage")}
          />
        </View>
      </View>

      {/* Discounts */}
      <View className="flex-row gap-2">
        <Controller
          control={control}
          name="discount_in_percentage"
          render={({ field }) => (
            <Input
              label="Discount %"
              placeholder="Discount %"
              onChangeText={(val) => {
                setLastEdited("percent");
                field.onChange(Number(val) || 0);
              }}
              value={String(field.value ?? 0)}
              className="flex-1"
            />
          )}
        />
        <Controller
          control={control}
          name="discount_in_rupees"
          render={({ field }) => (
            <Input
              label="Discount (₹)"
              placeholder="Discount (₹)"
              onChangeText={(val) => {
                setLastEdited("rupees");
                field.onChange(Number(val) || 0);
              }}
              value={String(field.value ?? 0)}
              className="flex-1"
            />
          )}
        />
      </View>

      {/* Advance */}
      {/* <Controller
        control={control}
        name="advance_amount"
        render={({ field }) => (
          <Input
            label="Advance Paid (₹)"
            placeholder="Advance Paid (₹)"
            onChangeText={(val) => field.onChange(Number(val) || 0)}
            value={String(field.value ?? 0)}
          />
        )}
      /> */}

      {/* Total */}
      <Controller
        control={control}
        name="total_amount"
        render={({ field }) => (
          <Input
            label="Total Amount (₹)"
            placeholder="Total Amount (₹)"
            value={String(field.value ?? 0)}
            editable={false}
            onChangeText={function (text: any): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      />

      {/* Payment Mode */}
      {/* <DataDropDown
        data={paymentModes}
        label="Mode Of Payment"
        value={watch("payment_mode")}
        onSelect={(id: string) => {
          const findMode = paymentModes.find((p) => p.id === id);
          if (findMode) {
            setValue("payment_mode", findMode.name);
          }
        }}
      /> */}

      {/* Payment Section */}
      <View className="p-4 border border-gray-900 rounded rounded-[25] mt-2">
        {fields.map((field, index) => (
          <AddPaymentRow
            key={field.id}
            control={control}
            index={index}
            setValue={setValue}
          />
        ))}
        <View>
          <Button
            name="Add Advance Payment"
            onPress={() => append({ amount_paid: 0, payment_mode: "" })}
          />
          {fields.length > 1 && (
            <Button
              name="Delete Last Payment"
              onPress={() => remove(fields.length - 1)}
              className="bg-red-700 border-black"
            />
          )}
        </View>
      </View>

      {/* Payment Status */}
      {/* <DataDropDown
        data={paymentStatus}
        label="Payment Received Fully"
        value={
          paymentStatus.find((p) => p.name === watch("payment_status"))?.name ||
          ""
        }
        onSelect={(id: string) => {
          const findStatus = paymentStatus.find((p) => p.id === id);
          if (findStatus) {
            setValue("payment_status", findStatus.name);
          }
        }}
      /> */}
      <Controller
        control={control}
        name="balance_amount"
        render={({ field }) => (
          <Input
            label="Balance Amount (₹)"
            placeholder="Balance Amount (₹)"
            value={String(field.value ?? 0)}
            editable={false}
            onChangeText={function (text: any): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="final_amount"
        render={({ field }) => (
          <Input
            label="Final Amount (₹)"
            placeholder="Final Amount (₹)"
            value={String(field.value ?? 0)}
            editable={false}
            onChangeText={function (text: any): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      />
      <Controller
        control={control}
        name="estimate_delivery_date"
        render={({ field }) => (
          <DatePicker
            label="Enter Edd"
            onChange={(date) => field.onChange(date)}
            value={field.value}
          />
        )}
      />

      {/* Submit */}
      <Button name={buttonName} onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

export default OrderForm;

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // gap: 12,
    // marginVertical: 10,
  },
});
