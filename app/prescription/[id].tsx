import { useLocalSearchParams } from "expo-router";
import { FormikHelpers } from "formik";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PrescriptionForm, { PrescriptionFormValues } from "./PrescriptionForm";

const PrescriptionEditAndDelete = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const leftinitialValues: PrescriptionFormValues = {
    eye: "left",
    sph: "",
    cyl: "",
    axis: "",
    va: "",
    add: "",
    dpd: "",
    npd: "",
  };

  const rightinitialValues: PrescriptionFormValues = {
    eye: "right",
    sph: "",
    cyl: "",
    axis: "",
    va: "",
    add: "",
    dpd: "",
    npd: "",
  };

  const handleSubmit = (
    values: PrescriptionFormValues,
    helpers: FormikHelpers<PrescriptionFormValues>
  ) => {
    console.log(values);
    helpers.resetForm();
  };

  return (
    <ScrollView className="p-4">
      <Text className="pb-2 text-2xl font-bold text-primary">Prescription</Text>

      {/* Left Eye */}
      <View className="p-6 border border-primary rounded-2xl mb-4">
        <Text className="mb-2 font-semibold">👁️ Left Eye</Text>
        <PrescriptionForm
          onSubmit={handleSubmit}
          buttonName="Add Left"
          initialValues={leftinitialValues}
        />
      </View>

      {/* Right Eye */}
      <View className="p-6 border border-primary rounded-2xl">
        <Text className="mb-2 font-semibold">👁️ Right Eye</Text>
        <PrescriptionForm
          onSubmit={handleSubmit}
          buttonName="Add Right"
          initialValues={rightinitialValues}
        />
      </View>
    </ScrollView>
  );
};

export default PrescriptionEditAndDelete;

const styles = StyleSheet.create({});
