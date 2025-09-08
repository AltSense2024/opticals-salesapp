import { useRouter } from "expo-router";
import { FormikHelpers } from "formik";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import prescription_services from "@/services/prescription_services";
import { useCustomerState } from "@/stores/CustomerStore";
import { usePrescriptionState } from "@/stores/PrescriptionStore";
import PrescriptionForm, { PrescriptionFormValues } from "./PrescriptionForm";

const Prescription = () => {
  const { addPrescription, prescriptionId } = usePrescriptionState();
  const { customer } = useCustomerState();
  const [leftAdded, setLeftAdded] = useState(false);
  const [rightAdded, setRightAdded] = useState(true);
  const router = useRouter();
  console.log("customer", customer);
  const handleSubmit = async (
    values: PrescriptionFormValues,
    helpers: FormikHelpers<PrescriptionFormValues>
  ) => {
    try {
      const formValues = { ...values, prescription_id: prescriptionId };
      const response =
        await prescription_services.create_prescription(formValues);

      if (response.status === 201) {
        addPrescription(response.data.id);

        if (values.eye === "right") {
          setRightAdded(false);
          setLeftAdded(true);
          Alert.alert("Success", "Right eye prescription saved.");
        }

        if (values.eye === "left") {
          router.push("/order/orderpage");
        }
      }

      helpers.resetForm();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save prescription.");
    }
  };

  return (
    <ScrollView className="p-8">
      <Text className="pb-2 text-2xl text-primary font-bold">Prescription</Text>
      <Text>{prescriptionId}</Text>

      {/* Left Eye */}
      {leftAdded && (
        <View className="p-6 border border-primary rounded-2xl mb-4">
          <Text className="mb-2 font-semibold">👁️ Left Eye</Text>
          <PrescriptionForm
            onSubmit={handleSubmit}
            buttonName="Add Left"
            initialValues={{ eye: "left" }}
          />
        </View>
      )}

      {rightAdded && (
        <View className="p-6 border border-primary rounded-2xl">
          <Text className="mb-2 font-semibold">👁️ Right Eye</Text>
          <PrescriptionForm
            onSubmit={handleSubmit}
            buttonName="Add Right"
            initialValues={{ eye: "right" }}
          />
        </View>
      )}

      {/* Right Eye */}

      {/* Skip directly to billing */}
      
    </ScrollView>
  );
};

export default Prescription;

const styles = StyleSheet.create({});
