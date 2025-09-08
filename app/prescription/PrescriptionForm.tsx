import Button from "@/components/Button"; // assume you have a button component
import DataDropDown from "@/components/DataDropDown";
import Input from "@/components/Input";

import { useCustomerState } from "@/stores/CustomerStore";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";

// 1. Types
export interface PrescriptionFormValues {
  customerId: string;
  eye: string;
  sph: string;
  cyl: string;
  axis: string;
  va: string;
  dpd: string;
  npd: string;
  add: string;
}

interface PrescriptionFormProps {
  initialValues?: Partial<PrescriptionFormValues>;
  onSubmit: (
    values: PrescriptionFormValues,
    helpers: FormikHelpers<PrescriptionFormValues>
  ) => void;
  buttonName: string;
}

// 2. Validation schema
const PrescriptionSchema = Yup.object().shape({
  sph: Yup.string().required("Required"),
  cyl: Yup.string().required("Required"),
  axis: Yup.string().required("Required"),
  va: Yup.string(),
  dpd: Yup.string(),
  npd: Yup.string(),
  add: Yup.string(),
});

// 3. Component
const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  initialValues,
  onSubmit,
  buttonName,
}) => {
  const { customer, customers, addCustomer, fetchCustomers } =
    useCustomerState();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const defaultValues: PrescriptionFormValues = {
    customerId: String(customer?.id),
    eye: "1",
    sph: "2",
    cyl: "3",
    axis: "4",
    va: "5",
    dpd: "6",
    npd: "7",
    add: "8",
    ...initialValues, // merge if editing
  };

  return (
    <Formik
      initialValues={defaultValues}
      enableReinitialize
      // validationSchema={PrescriptionSchema}
      onSubmit={onSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View className="w-full">
          <View className="my-2">
            <DataDropDown
              data={customers}
              label="Customer Name"
              value={customer?.id ?? ""}
              onSelect={(id: string) => {
                const selectedCustomer = customers.find((c) => c.id === id);

                if (!selectedCustomer) return;
                addCustomer(selectedCustomer);
                setFieldValue("customerId", selectedCustomer.id);
              }}
            />

            <Text>{customer?.id}</Text>
          </View>

          <Text className="text-xl font-bold text-primary py-2">
            Distance Vision :
          </Text>
          {/* First row */}
          <View className="flex-row justify-between mb-5 gap-3">
            <Input
              className="flex-[3]"
              placeholder="SPH"
              label="SPH"
              value={values.sph}
              onChangeText={handleChange("sph")}
              // onBlur={handleBlur("sph")}
              // error={touched.sph ? errors.sph : undefined}
            />
            <Input
              className="flex-[3]"
              placeholder="CYL"
              label="CYL"
              value={values.cyl}
              onChangeText={handleChange("cyl")}
              // onBlur={handleBlur("cyl")}
              // error={touched.cyl ? errors.cyl : undefined}
            />
          </View>

          {/* Second row */}
          <View className="flex-row justify-between mb-4 gap-3">
            <Input
              className="flex-[3]"
              placeholder="AXIS"
              label="AXIS"
              value={values.axis}
              onChangeText={handleChange("axis")}
              // onBlur={handleBlur("axis")}
              // error={touched.axis ? errors.axis : undefined}
            />
            <Input
              className="flex-[3]"
              placeholder="VA"
              label="VA"
              value={values.va}
              onChangeText={handleChange("va")}
              // onBlur={handleBlur("va")}
              // error={touched.va ? errors.va : undefined}
            />
          </View>

          {/* Third row */}
          <View className="flex-row justify-between mb-4 gap-3">
            <Input
              className="flex-[3]"
              placeholder="DPD"
              label="DPD"
              value={values.dpd}
              onChangeText={handleChange("dpd")}
              // onBlur={handleBlur("dpd")}
              // error={touched.dpd ? errors.dpd : undefined}
            />
            <Input
              className="flex-[3]"
              placeholder="NPD"
              label="NPD"
              value={values.npd}
              onChangeText={handleChange("npd")}
              // // onBlur={handleBlur("npd")}
              // error={touched.npd ? errors.npd : undefined}
            />
          </View>
          <Text className="text-xl font-bold text-primary py-2">
            Near Vision :
          </Text>
          {/* Fourth row */}
          <View className="mb-4">
            <Input
              placeholder="ADD"
              label="ADD"
              value={values.add}
              onChangeText={handleChange("add")}
              // onBlur={handleBlur("add")}
              // error={touched.add ? errors.add : undefined}
            />
          </View>

          {/* Submit button */}
          <Button name={buttonName} onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};

export default PrescriptionForm;

const styles = StyleSheet.create({});
