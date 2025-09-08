import Button from "@/components/Button";
import DataDropDown from "@/components/DataDropDown";
import Input from "@/components/Input";
import OrderProductCard from "@/components/OrderProductCard";
import { useCustomerState } from "@/stores/CustomerStore";
import { useProductState } from "@/stores/OrderFormProductsStore";
import { useRouter } from "expo-router";

import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export interface OrderFormValues {
  customer_id: string;
  products: {
    product_id: string;
    productName: string;
    price: number;

    imageUrl?: any;
    quantity: number;
    total_amount?: number;
    discount_in_percentage?: number;
    discount_in_rupees?: number;
  }[];
  advance_amount: number;
  discount_in_percentage: number;
  discount_in_rupees: number;
  total_amount: number;
  payment_mode: string;
}

interface OrderFormProps {
  initialValues: Partial<OrderFormValues>;
  buttonName: string;
  onSubmit: (values: OrderFormValues) => void;
}

const paymentModes = [
  { id: 1, name: "Gpay" },
  { id: 2, name: "Card" },
  { id: 3, name: "Cash" },
];

const OrderForm: React.FC<OrderFormProps> = ({
  initialValues,
  buttonName,
  onSubmit,
}) => {
  const router = useRouter();
  const { fetchCustomers, customers, customer, addCustomer } =
    useCustomerState();
  const { deleteProduct, editProduct } = useProductState();

  const [lastEdited, setLastEdited] = useState<"percent" | "rupees" | null>(
    null
  );

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<OrderFormValues>({
      defaultValues: {
        customer_id: customer?.id ?? "",
        products: [],
        discount_in_percentage: 0,
        discount_in_rupees: 0,
        advance_amount: 0,
        total_amount: 0,
        payment_mode: "",
        ...initialValues,
      },
    });

  // enableReinitialize equivalent
  useEffect(() => {
    reset({
      customer_id: customer?.id ?? "",
      products: [],
      discount_in_percentage: 0,
      discount_in_rupees: 0,
      advance_amount: 0,
      total_amount: 0,
      payment_mode: "",
      ...initialValues,
    });
  }, [initialValues, customer, reset]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // watch values
  const products = useWatch({ control, name: "products" }) || [];
  const discountPercent = useWatch({ control, name: "discount_in_percentage" });
  const discountRupees = useWatch({ control, name: "discount_in_rupees" });
  const advance = useWatch({ control, name: "advance_amount" });

  // recalc totals
  useEffect(() => {
    const subtotal = products.reduce((sum, p) => {
      console.log("products", products);
      const price = Number(p?.price) || 0;
      const qty = Number(p?.quantity) || 0;
      const gst = Number(12) || 0;
      const discount = Number(p?.discount_in_rupees) || 0;

      const base = price * qty;

      const gstAmount = base * (gst / 100);

      const total = base - discount;
      const totalWithGSt = total + gstAmount;

      return sum + totalWithGSt;
    }, 0);

    console.log("subtotal", subtotal);
    let newDiscountRupees = Number(discountRupees) || 0;
    let newDiscountPercent = Number(discountPercent) || 0;

    if (lastEdited === "percent") {
      newDiscountRupees = (newDiscountPercent / 100) * subtotal;
      setValue("discount_in_rupees", Number(newDiscountRupees.toFixed(2)));
    }

    if (lastEdited === "rupees") {
      newDiscountPercent =
        subtotal > 0 ? (newDiscountRupees / subtotal) * 100 : 0;
      setValue("discount_in_percentage", Number(newDiscountPercent.toFixed(2)));
    }

    const total = subtotal - newDiscountRupees - (Number(advance) || 0);
    setValue("total_amount", Number(total.toFixed(2)));
  }, [
    products,
    discountPercent,
    discountRupees,
    advance,
    lastEdited,
    setValue,
  ]);

  return (
    <View>
      <View className="flex-col gap-2">
        {/* Customer Dropdown */}
        <DataDropDown
          data={customers}
          label="Customer Name"
          value={customer?.id ?? ""}
          onSelect={(id: string) => {
            const selectedCustomer = customers.find((c) => c.id == id);
            if (!selectedCustomer) return;
            addCustomer(selectedCustomer);
            setValue("customer_id", selectedCustomer.id);
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

        {/* Products List */}
        <View>
          {products.map((product, index) => (
            <OrderProductCard
              key={product.product_id}
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
              id={""}
              onChangeQuantity={(newQty) => {
                const newTotal = product.price * newQty;
                const updated = [...products];
                updated[index] = {
                  ...updated[index],
                  quantity: newQty,
                  total_amount: newTotal,
                };
                setValue("products", updated);

                // editProduct({
                //   ...product,
                //   quantity: newQty,
                //   total_amount: newTotal,
                // });
              }}
            />
          ))}
        </View>

        {/* Add Product Button */}
        <View className="items-center my-2">
          <View className="w-[50%]">
            <Button
              name="Add Product"
              onPress={() => router.push("/addproduct/addproductpage")}
            />
          </View>
        </View>
        <View className="flex-row gap-1">
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
                value={String(field.value)}
                className="flex-[2]"
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
                value={String(field.value)}
                className="flex-[2]"
              />
            )}
          />
        </View>
        {/* Discounts */}

        {/* Advance */}
        <Controller
          control={control}
          name="advance_amount"
          render={({ field }) => (
            <Input
              label="Advance Paid (₹)"
              placeholder="Advance Paid (₹)"
              onChangeText={(val) => field.onChange(Number(val) || 0)}
              value={String(field.value)}
              className="flex-[2]"
            />
          )}
        />

        {/* Total */}
        <Controller
          control={control}
          name="total_amount"
          render={({ field }) => (
            <Input
              label="Total Amount (₹)"
              placeholder="Total Amount (₹)"
              value={String(field.value)}
              editable={false}
              onChangeText={function (text: any): void {
                throw new Error("Function not implemented.");
              }}
            />
          )}
        />

        {/* Payment Mode */}
        <DataDropDown
          data={paymentModes}
          label="Mode Of Payment"
          value={watch("payment_mode")}
          onSelect={(id: string) => {
            const findMode = paymentModes.find((p) => p.id == Number(id));
            if (findMode) {
              setValue("payment_mode", findMode.name);
            }
          }}
        />

        <Button name={buttonName} onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default OrderForm;

const styles = StyleSheet.create({});
