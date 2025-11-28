import Button from "@/components/Button";
import CustomHeader from "@/components/Header";
import SuccessAndErrorModal from "@/components/SuccessAndErrorModal";
import { useAuth } from "@/context/authContext";
import { useApiResponseHandle } from "@/hooks/useApiResponseHandle";
import customer_services from "@/services/customer_services";
import { useCustomerState } from "@/stores/CustomerStore";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomerForm from "../customer/CustomerForm";

const AddCustomer = () => {
  const { addCustomer, customer } = useCustomerState();
  const { status, message, open, setOpen, onPress, showModal } =
    useApiResponseHandle();
  const { user } = useAuth();
  const router = useRouter();

  const create_customer = async (values: any) => {
    try {
      showModal("loading", "");
      const formValues = { ...values, salesperson_id: user?.id };
      const response = await customer_services.create_customer(formValues);
      console.log("response", response);
      if (response.status === 201) {
        // router.push("/prescription/prescription"); // ✅ use variable
        addCustomer(response.data.customer_details);
        showModal(
          "success",
          "Customer created successfully!",
          () => {
            setOpen(false);
            router.replace("/prescription/prescription");
          },
          2000
        );
      }
      console.log("response", response);
    } catch (error: any) {
      console.log("error", error);

      showModal("error", error.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid={true}
      extraScrollHeight={100} // pushes up form when keyboard appears
      keyboardShouldPersistTaps="handled"
    >
      <CustomHeader title="Add Customer" />

      <View className="border-2 border-primary p-3 rounded-2xl mb-4">
        <Text className="text-primary font-bold pb-2 text-xl">
          Customer Data Entry Form
        </Text>
        <View>
          <CustomerForm
            buttonName="Add Customer"
            onSubmit={(values) => create_customer(values)}
          />
        </View>
{/* 
        <Button
          name="Bill page"
          onPress={() => useRouter().push("/order/orderpage")}
        /> */}
      </View>
      <SuccessAndErrorModal
        status={status}
        message={message}
        button="OK"
        modalOpen={open}
        setModalOpen={setOpen}
        onPress={onPress}
      />
    </KeyboardAwareScrollView>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 26,
  },
});
