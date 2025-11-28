import Button from "@/components/Button";
import DataDropDown from "@/components/DataDropDown";
import Input from "@/components/Input";
import { useProductContext } from "@/context/ProductContext";
import { calculateDiscount } from "@/utils/calculatediscount";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { ProductFormData, productSchema } from "./AddProductFormSchema";

const AddProductForm = ({
  defaultValues,
  onSubmit,
  buttonName,
}: {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  buttonName: string;
}) => {
  const { products, fetchProducts } = useProductContext();
  const [lastEdited, setLastEdited] = useState<"percent" | "rupees" | null>(
    null
  );

  useEffect(() => {
    if (defaultValues) {
      if (
        defaultValues.discount_in_rupees &&
        defaultValues.discount_in_rupees > 0
      ) {
        setLastEdited("rupees");
      } else if (
        defaultValues.discount_in_percentage &&
        defaultValues.discount_in_percentage > 0
      ) {
        setLastEdited("percent");
      } else {
        setLastEdited("rupees"); // safe default
      }
    }
  }, [defaultValues]);

  useEffect(() => {
    fetchProducts();
  }, []);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_id: defaultValues?.product_id || "",
      productName: defaultValues?.productName || "",
      price: defaultValues?.price || 0,
      quantity: defaultValues?.quantity || 1,
      discount_in_percentage: defaultValues?.discount_in_percentage || 0,
      discount_in_rupees: defaultValues?.discount_in_rupees || 0,
      total_amount: defaultValues?.total_amount || 0,
    },
  });

  const price = watch("price");
  const quantity = watch("quantity");
  const discountPercent = watch("discount_in_percentage") ?? 0;
  const discountRupees = watch("discount_in_rupees") ?? 0;

  useEffect(() => {
    const {
      discountInPercent: newPercent,
      discountInRupees: newRupees,
      total,
    } = calculateDiscount(
      quantity,
      price,
      discountPercent,
      discountRupees,
      lastEdited
    );

    setValue("discount_in_percentage", Number(newPercent.toFixed(2)), {
      shouldValidate: true,
    });
    setValue("discount_in_rupees", Number(newRupees.toFixed(2)), {
      shouldValidate: true,
    });
    setValue("total_amount", Number(total.toFixed(2)), {
      shouldValidate: true,
    });
  }, [
    price,
    quantity,
    discountPercent,
    discountRupees,
    lastEdited,
    defaultValues?.discount_in_rupees,
  ]);

  return (
    <View>
      {/* Product Name */}
      <Controller
        name="productName"
        control={control}
        render={({ field }) => (
          <DataDropDown
            data={products}
            label="Product Name"
            value={field.value}
            onSelect={(id) => {
              const selected = products.find((item) => item.id === id);
              setValue("product_id", selected?.id);
              setValue("productName", selected?.name ?? "");
              if (selected) {
                setValue("price", selected.price);
                setValue("quantity", 1);
              }
            }}
            loadPage={async (page, q, pageSize) => {
              console.log("loading products page:", page, "q:", q);

              await fetchProducts({
                page,
                limit: pageSize,
                q,
                replace: page === 1,
              });

              return {
                items: products.map((p) => ({
                  id: p.id,
                  label: p.name,
                  value: p.id,
                  price: p.price,
                })),
                hasMore,
              };
            }}
          />
        )}
      />

      {/* Price */}
      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <Input
            label="Price"
            placeholder="Price"
            onChangeText={(val) => field.onChange(Number(val))}
            value={String(field.value)}
          />
        )}
      />

      {/* Quantity */}
      <Controller
        name="quantity"
        control={control}
        render={({ field }) => (
          <Input
            label="Quantity"
            placeholder="Quantity"
            onChangeText={(val) => field.onChange(Number(val))}
            value={String(field.value)}
          />
        )}
      />

      <View className="flex-row gap-1">
        {/* Discount % */}
        <Controller
          name="discount_in_percentage"
          control={control}
          render={({ field }) => (
            <Input
              label="Discount %"
              placeholder="Discount %"
              onChangeText={(val) => {
                field.onChange(Number(val));
                setLastEdited("percent");
              }}
              value={String(field.value)}
              className="flex-1"
            />
          )}
        />

        {/* Discount ₹ */}
        <Controller
          name="discount_in_rupees"
          control={control}
          render={({ field }) => (
            <Input
              label="Discount (₹)"
              placeholder="Discount (₹)"
              onChangeText={(val) => {
                field.onChange(Number(val));
                setLastEdited("rupees");
              }}
              value={String(field.value)}
              className="flex-1"
            />
          )}
        />
      </View>

      {/* Total */}
      <Controller
        name="total_amount"
        control={control}
        render={({ field }) => (
          <View className="rounded-lg">
            <Input
              label="Total Amount"
              placeholder="Total Amount"
              onChangeText={(val) => field.onChange(Number(val))}
              value={String(field.value)}
            />
          </View>
        )}
      />

      {/* Submit */}
      <Button
        onPress={handleSubmit((data) => onSubmit(data))}
        name={buttonName}
      />
    </View>
  );
};

export default AddProductForm;
