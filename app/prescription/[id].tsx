import prescription_services from "@/services/prescription_services";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import PrescriptionForm, { PrescriptionFormValues } from "./PrescriptionForm";
import CustomHeader from "@/components/Header";
import { useApiResponseHandle } from "@/hooks/useApiResponseHandle";

const PrescriptionEditAndDelete = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, message, open, setOpen, onPress, showModal } =
    useApiResponseHandle();

  const [leftInitialValues, setLeftInitialValues] =
    useState<PrescriptionFormValues | null>(null);
  const [rightInitialValues, setRightInitialValues] =
    useState<PrescriptionFormValues | null>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Load right eye on mount
  useEffect(() => {
    const loadRight = async () => {
      try {
        const response = await prescription_services.get_prescription_by_id(id);
        const rightData = response.data.eyes.find(
          (eye: any) => eye.eye === "right"
        );
        if (rightData) {
          setRightInitialValues({
            customerId: response.data.customer_id,
            eye: "right",
            sph: rightData.sph ?? "",
            cyl: rightData.cyl ?? "",
            axis: rightData.axis ?? "",
            va: rightData.va ?? "",
            add: rightData.add ?? "",
            dpd: rightData.dpd ?? "",
            npd: rightData.npd ?? "",
          });
          setShowRight(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadRight();
  }, [id]);

  const handleRightSubmit = async (values: PrescriptionFormValues) => {
    const formValues = { ...values, prescription_id: id };
    const response = await prescription_services.update_prescription(
      id,
      formValues
    );

    if (response.status == 200) {
      showModal(
        "success",
        "Right Eye Prescription Updated",
        () => {
          setShowRight(false);
        },
        1000
      );

      try {
        const response = await prescription_services.get_prescription_by_id(id);
        const leftData = response.data.eyes.find(
          (eye: any) => eye.eye === "left"
        );
        if (leftData) {
          setLeftInitialValues({
            customerId: response.data.customer_id,
            eye: "left",
            sph: leftData.sph ?? "",
            cyl: leftData.cyl ?? "",
            axis: leftData.axis ?? "",
            va: leftData.va ?? "",
            add: leftData.add ?? "",
            dpd: leftData.dpd ?? "",
            npd: leftData.npd ?? "",
          });
          setShowLeft(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLeftSubmit = async (values: PrescriptionFormValues) => {
    const formValues = { ...values, prescription_id: id };
    const response = await prescription_services.update_prescription(
      id,
      formValues
    );

    if (response.status == 200) {
      showModal(
        "success",
        "Left Eye Prescription Updated",
        () => {
          setShowRight(false);
          useRouter().back();
        },
        1000
      );
    }
  };

  return (
    <ScrollView className="p-4">
      <CustomHeader title="Prescription For Edit " />
      <Text className="pb-2 text-2xl font-bold text-primary">Prescription</Text>

      {/* Right Eye */}
      {showRight && rightInitialValues && (
        <View className="p-6 border border-primary rounded-2xl mb-4">
          <Text className="mb-2 font-semibold">👁️ Right Eye</Text>
          <PrescriptionForm
            onSubmit={handleRightSubmit}
            buttonName="Update Right 1"
            initialValues={rightInitialValues}
          />
        </View>
      )}

      {/* Left Eye */}
      {showLeft && leftInitialValues && (
        <View className="p-6 border border-primary rounded-2xl">
          <Text className="mb-2 font-semibold">👁️ Left Eye</Text>
          <PrescriptionForm
            onSubmit={handleLeftSubmit}
            buttonName="Update Left"
            initialValues={leftInitialValues}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default PrescriptionEditAndDelete;
