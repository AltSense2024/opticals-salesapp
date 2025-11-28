// import Button from "@/components/Button";
// import DataDropDown from "@/components/DataDropDown";
// import Input from "@/components/Input";

// import { useCustomerState } from "@/stores/CustomerStore";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useEffect } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { StyleSheet, Text, View } from "react-native";
// import { z } from "zod";

// // 1. Types + Schema
// const PrescriptionSchema = z.object({
//   customerId: z.string().min(1, "Customer is required"),
//   eye: z.string().optional(),
//   sph: z.string().min(1, "SPH is required"),
//   cyl: z.string().min(1, "CYL is required"),
//   axis: z.string().min(1, "AXIS is required"),
//   va: z.string().optional(),
//   dpd: z.string().optional(),
//   npd: z.string().optional(),
//   add: z.string().optional(),
// });

// export type PrescriptionFormValues = z.infer<typeof PrescriptionSchema>;

// interface PrescriptionFormProps {
//   initialValues?: Partial<PrescriptionFormValues>;
//   onSubmit: (values: PrescriptionFormValues) => void;
//   buttonName: string;
// }

// // 2. Component
// const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
//   initialValues,
//   onSubmit,
//   buttonName,
// }) => {
//   const { customer, customers, addCustomer, fetchCustomers } =
//     useCustomerState();

//   useEffect(() => {
//     fetchCustomers();
//   }, [fetchCustomers]);

//   const defaultValues: PrescriptionFormValues = {
//     customerId: String(customer?.id ?? ""),
//     eye: "1",
//     sph: "2",
//     cyl: "3",
//     axis: "4",
//     va: "5",
//     dpd: "6",
//     npd: "7",
//     add: "8",
//     ...initialValues,
//   };

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<PrescriptionFormValues>({
//     defaultValues,
//     resolver: zodResolver(PrescriptionSchema),
//   });

//   return (
//     <View className="w-full">
//       {/* Customer Selection */}
//       <View className="my-2">
//         <DataDropDown
//           data={customers}
//           label="Customer Name"
//           value={customer?.id ?? ""}
//           onSelect={(id: string) => {
//             const selectedCustomer = customers.find((c) => c.id === id);

//             if (!selectedCustomer) return;
//             addCustomer(selectedCustomer);
//             setValue("customerId", selectedCustomer.id);
//           }}
//         />
//       </View>

//       <Text className="text-xl font-bold text-primary py-2">
//         Distance Vision :
//       </Text>

//       {/* First row */}
//       <View className="flex-row justify-between mb-5 gap-3">
//         <Controller
//           control={control}
//           name="sph"
//           render={({ field }) => (
//             <Input
//               className="flex-[3]"
//               placeholder="SPH"
//               label="SPH"
//               {...field}
//               value={field.value}
//               onChangeText={field.onChange}
//               // error={errors.sph?.message}
//             />
//           )}
//         />
//         <Controller
//           control={control}
//           name="cyl"
//           render={({ field }) => (
//             <Input
//               className="flex-[3]"
//               placeholder="CYL"
//               label="CYL"
//               {...field}
//               value={field.value}
//               onChangeText={field.onChange}
//               // error={errors.cyl?.message}
//             />
//           )}
//         />
//       </View>

//       {/* Second row */}
//       <View className="flex-row justify-between mb-4 gap-3">
//         <Controller
//           control={control}
//           name="axis"
//           render={({ field }) => (
//             <Input
//               className="flex-[3]"
//               placeholder="AXIS"
//               label="AXIS"
//               {...field}
//               value={field.value}
//               onChangeText={field.onChange}
//               // error={errors.axis?.message}
//             />
//           )}
//         />
//         <Controller
//           control={control}
//           name="va"
//           render={({ field }) => (
//             <Input
//               className="flex-[3]"
//               placeholder="VA"
//               label="VA"
//               {...field}
//               value={field.value}
//               onChangeText={field.onChange}
//               // error={errors.va?.message}
//             />
//           )}
//         />
//       </View>

//       {/* Third row */}
//       <View className="flex-row justify-between mb-4 gap-3">
//         <Controller
//           control={control}
//           name="dpd"
//           render={({ field }) => (
//             <Input
//               className="flex-[3]"
//               placeholder="DPD"
//               label="DPD"
//               {...field}
//               value={field.value}
//               onChangeText={field.onChange}
//               // error={errors.dpd?.message}
//             />
//           )}
//         />
//         <Controller
//           control={control}
//           name="npd"
//           render={({ field }) => (
//             <Input
//               className="flex-[3]"
//               placeholder="NPD"
//               label="NPD"
//               {...field}
//               value={field.value}
//               onChangeText={field.onChange}
//               // error={errors.npd?.message}
//             />
//           )}
//         />
//       </View>

//       <Text className="text-xl font-bold text-primary py-2">Near Vision :</Text>

//       {/* Fourth row */}
//       <View className="mb-4">
//         <Controller
//           control={control}
//           name="add"
//           render={({ field }) => (
//             <Input
//               placeholder="ADD"
//               label="ADD"
//               {...field}
//               value={field.value}
//               onChangeText={field.onChange}
//               // error={errors.add?.message}
//             />
//           )}
//         />
//       </View>

//       {/* Submit button */}
//       <Button
//         name={buttonName}
//         onPress={() => {
//           const formValues = watch();
//           onSubmit(formValues);
//         }}
//       />
//     </View>
//   );
// };

// export default PrescriptionForm;

// const styles = StyleSheet.create({});
import Button from "@/components/Button";
import DataDropDown from "@/components/DataDropDown";
import Input from "@/components/Input";

import { useCustomerState } from "@/stores/CustomerStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";

// 1. Types + Schema
// const PrescriptionSchema = z.object({
//   customerId: z.string().min(1, "Customer is required"),
//   eye: z.string().optional(),
//   sph: z.string().min(1, "SPH is required"),
//   cyl: z.string().min(1, "CYL is required"),
//   axis: z.string().min(1, "AXIS is required"),
//   va: z.string().optional(),
//   dpd: z.string().optional(),
//   npd: z.string().optional(),
//   add: z.string().optional(),
// });
const optionalNumber = z
  .string()
  .transform((v) => (v === "" ? null : Number(v)))
  .refine((v) => v === null || !isNaN(v), {
    message: "Invalid number",
  });

const PrescriptionSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  eye: z.string().optional(),

  sph: z
    .string()
    .min(1, "SPH is required")
    .transform((v) => Number(v)),

  cyl: z
    .string()
    .min(1, "CYL is required")
    .transform((v) => Number(v)),

  axis: z
    .string()
    .min(1, "AXIS is required")
    .transform((v) => Number(v)),

  // Optional numeric fields
  va: optionalNumber,
  dpd: optionalNumber,
  npd: optionalNumber,
  add: optionalNumber,
});

export type PrescriptionFormValues = z.infer<typeof PrescriptionSchema>;

interface PrescriptionFormProps {
  initialValues?: Partial<PrescriptionFormValues>;
  onSubmit: (values: PrescriptionFormValues) => void;
  buttonName: string;
}

/* ---------- Helpers for option generation (produce {id, name}) ---------- */
const makeOptionsStrings = (min: number, max: number, step: number) => {
  const arr: string[] = [];
  for (let v = min; v <= max + 1e-9; v = +(v + step).toFixed(10)) {
    arr.push((Math.round(v * 100) / 100).toFixed(2));
  }
  return arr;
};

const makeOptionsObjects = (min: number, max: number, step: number) =>
  makeOptionsStrings(min, max, step).map((v) => ({ id: v, name: v }));

const SPH_OPTIONS = makeOptionsObjects(-20, 20, 0.25); // -20.00 -> +20.00
const CYL_OPTIONS = makeOptionsObjects(-6, 0, 0.25); // -6.00 -> 0.00
const AXIS_OPTIONS = Array.from({ length: 181 }, (_, i) => ({
  id: String(i),
  name: String(i),
})); // 0 -> 180
const ADD_OPTIONS = makeOptionsObjects(0.75, 4, 0.25); // +0.75 -> +4.00

// 2. Component
const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  initialValues,
  onSubmit,
  buttonName,
}) => {
  const { customer, customers, addCustomer, fetchCustomers } =
    useCustomerState();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const defaultValues: PrescriptionFormValues = {
    customerId: String(customer?.id ?? ""),
    eye: "1",
    sph: 0, // leave empty so user must pick (validation requires)
    cyl: 0,
    axis: 0,
    va: 0,
    dpd: 0,
    npd: 0,
    add: 0,
    ...initialValues,
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PrescriptionFormValues>({
    defaultValues,
    resolver: zodResolver(PrescriptionSchema),
  });

  return (
    <View className="w-full">
      {/* Customer Selection */}
      <View className="my-2">
        {/* <DataDropDown
          data={customers}
          label="Customer Name"
          value={customer?.id ?? ""}
          onSelect={(id: string) => {
            const selectedCustomer = customers.find((c) => c.id === id);

            if (!selectedCustomer) return;
            addCustomer(selectedCustomer);
            setValue("customerId", selectedCustomer.id);
          }}
        /> */}
        <DataDropDown
          label="Customer"
          value={customer?.name ?? ""}
          onSelect={(id) => {
            const sel = customers.find((c) => String(c.id) === String(id));
            if (sel) {
              addCustomer(sel);
              setValue("customerId", sel.id);
            } else {
              // fallback: just set id
              setValue("customerId", String(id));
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
      </View>

      <Text className="text-xl font-bold text-primary py-2">
        Distance Vision :
      </Text>

      {/* First row: SPH, CYL (use your DataDropDown) */}
      <View className="flex-row justify-between mb-5 gap-3">
        <Controller
          control={control}
          name="sph"
          render={({ field }) => (
            <View className="flex-[3]">
              <DataDropDown
                data={SPH_OPTIONS}
                label="SPH"
                value={field.value}
                onSelect={(val: string) => field.onChange(val)}
              />
              {errors.sph?.message && (
                <Text style={styles.error}>{String(errors.sph.message)}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="cyl"
          render={({ field }) => (
            <View className="flex-[3]">
              <DataDropDown
                data={CYL_OPTIONS}
                label="CYL"
                value={field.value}
                onSelect={(val: string) => field.onChange(val)}
              />
              {errors.cyl?.message && (
                <Text style={styles.error}>{String(errors.cyl.message)}</Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Second row: AXIS, VA */}
      <View className="flex-row justify-between mb-4 gap-3">
        <Controller
          control={control}
          name="axis"
          render={({ field }) => (
            <View className="flex-[3]">
              <DataDropDown
                data={AXIS_OPTIONS}
                label="AXIS"
                value={field.value}
                onSelect={(val: string) => field.onChange(val)}
              />
              {errors.axis?.message && (
                <Text style={styles.error}>{String(errors.axis.message)}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="va"
          render={({ field }) => (
            <Input
              className="flex-[3]"
              placeholder="VA"
              label="VA"
              {...field}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
      </View>

      {/* Third row: DPD, NPD */}
      <View className="flex-row justify-between mb-4 gap-3">
        <Controller
          control={control}
          name="dpd"
          render={({ field }) => (
            <Input
              className="flex-[3]"
              placeholder="DPD"
              label="DPD"
              {...field}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="npd"
          render={({ field }) => (
            <Input
              className="flex-[3]"
              placeholder="NPD"
              label="NPD"
              {...field}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
      </View>

      <Text className="text-xl font-bold text-primary py-2">Near Vision :</Text>

      {/* Fourth row: ADD (use DataDropDown) */}
      <View className="mb-4">
        <Controller
          control={control}
          name="add"
          render={({ field }) => (
            <View>
              <DataDropDown
                data={ADD_OPTIONS}
                label="ADD"
                value={field.value}
                onSelect={(val: string) => field.onChange(val)}
              />
              {errors.add?.message && (
                <Text style={styles.error}>{String(errors.add.message)}</Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Submit button */}
      <Button
        name={buttonName}
        onPress={() => {
          const formValues = watch();
          onSubmit(formValues);
        }}
      />
    </View>
  );
};

export default PrescriptionForm;

const styles = StyleSheet.create({
  error: {
    color: "#d9534f",
    fontSize: 12,
    marginTop: 6,
  },
});
