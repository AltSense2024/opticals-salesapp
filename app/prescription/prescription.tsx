// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import prescription_services from "@/services/prescription_services";
// import { useCustomerState } from "@/stores/CustomerStore";
// import { usePrescriptionState } from "@/stores/PrescriptionStore";
// import PrescriptionForm, { PrescriptionFormValues } from "./PrescriptionForm";
// import { useApiResponseHandle } from "@/hooks/useApiResponseHandle";
// import { fa } from "zod/v4/locales";
// import SuccessAndErrorModal from "@/components/SuccessAndErrorModal";

// const Prescription = () => {
//   const { addPrescription, prescriptionId } = usePrescriptionState();
//   const { customer } = useCustomerState();
//   const [leftAdded, setLeftAdded] = useState(false);
//   const [rightAdded, setRightAdded] = useState(true);
//   const { status, message, open, setOpen, onPress, showModal } =
//     useApiResponseHandle();
//   const router = useRouter();

//   console.log("customer", customer);

//   const handleSubmit = async (
//     values: PrescriptionFormValues,
//     reset: () => void
//   ) => {
//     try {
//       showModal("loading", "");
//       const formValues = { ...values, prescription_id: prescriptionId };
//       const response =
//         await prescription_services.create_prescription(formValues);
//       if (response.status === 201) {
//         addPrescription(response.data.id);

//         if (values.eye === "right") {
//           setRightAdded(false);

//           showModal(
//             "success",
//             "Prescription Right Eye Saved",
//             () => {
//               setOpen(false);
//               setLeftAdded(true);
//             },
//             1000
//           );
//         }

//         if (values.eye === "left") {
//           showModal(
//             "success",
//             "Prescription created successfully!",
//             () => {
//               setOpen(false);
//               router.replace("/order/orderpage");

//             },
//             2000
//           );
//         }
//       }

//       reset(); // reset RHF form after successful submit
//     } catch (error: any) {
//       console.error(error);
//       showModal("error", error.message);
//     }
//   };

//   return (
//     <ScrollView className="p-8">
//       <Text className="pb-2 text-2xl text-primary font-bold">Prescription</Text>

//       {/* Left Eye */}
//       {leftAdded && (
//         <View className="p-6 border border-primary rounded-2xl mb-4">
//           <Text className="mb-2 font-semibold">👁️ Left Eye</Text>
//           <PrescriptionForm
//             onSubmit={(values) => handleSubmit(values, () => {})}
//             buttonName="Add Left"
//             initialValues={{ eye: "left" }}
//           />
//         </View>
//       )}

//       {/* Right Eye */}
//       {rightAdded && (
//         <View className="p-6 border border-primary rounded-2xl">
//           <Text className="mb-2 font-semibold">👁️ Right Eye</Text>
//           <PrescriptionForm
//             onSubmit={(values) => handleSubmit(values, () => {})}
//             buttonName="Add Right"
//             initialValues={{ eye: "right" }}
//           />
//         </View>
//       )}
//       <TouchableOpacity onPress={() => useRouter().push("/order/orderpage")}>
//         <Text className="text-gray-800"> Skip </Text>
//       </TouchableOpacity>
//       <SuccessAndErrorModal
//         status={status}
//         message={message}
//         button="OK"
//         modalOpen={open}
//         setModalOpen={setOpen}
//         onPress={onPress}
//       />
//       {/* You could also add a skip button here for billing */}
//     </ScrollView>
//   );
// };

// export default Prescription;

// const styles = StyleSheet.create({});
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import prescription_services from "@/services/prescription_services";
import { useCustomerState } from "@/stores/CustomerStore";
import { usePrescriptionState } from "@/stores/PrescriptionStore";
import PrescriptionForm, { PrescriptionFormValues } from "./PrescriptionForm";
import { useApiResponseHandle } from "@/hooks/useApiResponseHandle";
import SuccessAndErrorModal from "@/components/SuccessAndErrorModal";
import { useBackToHome } from "@/hooks/useBackToHome";

const Prescription = () => {
  const { addPrescription, prescriptionId } = usePrescriptionState();
  const { customer, clearCustomer } = useCustomerState();
  const [leftAdded, setLeftAdded] = useState(false);
  const [rightAdded, setRightAdded] = useState(true);
  const { status, message, open, setOpen, onPress, showModal } =
    useApiResponseHandle();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  useBackToHome();
  console.log("customer", customer);

  const handleSubmit = async (
    values: PrescriptionFormValues,
    reset: () => void
  ) => {
    try {
      showModal("loading", "");
      const formValues = { ...values, prescription_id: prescriptionId };
      const response =
        await prescription_services.create_prescription(formValues);
      if (response.status === 201) {
        addPrescription(response.data.id);

        if (values.eye === "right") {
          setRightAdded(false);

          showModal(
            "success",
            "Prescription Right Eye Saved",
            () => {
              setOpen(false);
              setLeftAdded(true);
            },
            1000
          );
        }

        if (values.eye === "left") {
          showModal(
            "success",
            "Prescription created successfully!",
            () => {
              setOpen(false);
              // small delay so modal closes nicely before navigation
              setTimeout(() => router.replace("/order/orderpage"), 50);
            },
            2000
          );
        }
      }

      reset(); // reset RHF form after successful submit
    } catch (error: any) {
      console.error(error);
      showModal("error", error.message ?? "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Prescription</Text>

        {/* Left Eye */}
        {leftAdded && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>👁️ Left Eye</Text>
            <PrescriptionForm
              onSubmit={(values) => handleSubmit(values, () => {})}
              buttonName="Add Left"
              initialValues={{ eye: "left" }}
            />
          </View>
        )}

        {/* Right Eye */}
        {rightAdded && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>👁️ Right Eye</Text>
            <PrescriptionForm
              onSubmit={(values) => handleSubmit(values, () => {})}
              buttonName="Add Right"
              initialValues={{ eye: "right" }}
            />
          </View>
        )}
      </ScrollView>

      {/* Fixed bottom bar with Skip and Submit/Next (Skip is secondary) */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        {rightAdded && (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => {
              setRightAdded(false);
              setLeftAdded(true);
            }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            // convenience: if you want to move to next screen without submitting
            // you could also call router.push("/order/orderpage") here
            router.replace("/order/orderpage");
          }}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <SuccessAndErrorModal
        status={status}
        message={message}
        button="OK"
        modalOpen={open}
        setModalOpen={setOpen}
        onPress={onPress}
      />
    </View>
  );
};

export default Prescription;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 }, // leave room for bottom bar
  title: {
    paddingBottom: 8,
    fontSize: 24,
    color: "#491B6D",
    fontWeight: "700",
  },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#491B6D",
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  cardTitle: { marginBottom: 8, fontSize: 16, fontWeight: "600" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
    justifyContent: "space-between",
    alignItems: "center",
  },

  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#9ca3af",
  },
  skipText: { color: "#374151", fontWeight: "600" },

  primaryBtn: {
    backgroundColor: "#491B6D",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
});
