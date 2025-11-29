import { useAuth } from "@/context/authContext";
import invoice_service from "@/services/invoice_service";
import { useCustomerState } from "@/stores/CustomerStore";
import { useProductState } from "@/stores/OrderFormProductsStore";
import { usePrescriptionState } from "@/stores/PrescriptionStore";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OrderForm from "./OrderForm";
import { HeaderBackButton } from "@react-navigation/elements";
import { useApiResponseHandle } from "@/hooks/useApiResponseHandle";
import SuccessAndErrorModal from "@/components/SuccessAndErrorModal";
import { useBackToHome } from "@/hooks/useBackToHome";

const orderpage = () => {
  const { products, clearProducts } = useProductState();
  const { customer, clearCustomer } = useCustomerState();
  const { prescriptionId } = usePrescriptionState();
  const { user } = useAuth();
  const { status, message, open, setOpen, onPress, showModal } =
    useApiResponseHandle();

  const [formKey, setFormKey] = useState(0);

  const navigation = useNavigation();
  const router = useRouter();
  useBackToHome()

  useEffect(() => {
    const sub = navigation.addListener("beforeRemove", (e) => {
      const t = e.data?.action?.type;
      if (t === "GO_BACK") {
        clearProducts();
      }
    });
    return sub;
  }, [navigation, clearProducts]);

  const handelSubmit = async (formValues: any) => {
    try {
      console.log("formValues", formValues,user?.id);
      showModal("loading", "");
      const values = {
        ...formValues,
        salesperson_id: user?.id,
        estimate_delivery_date: formValues.estimate_delivery_date.toISOString(),
        doc_type: "order",
      };
      console.log('values', values)
      const response = await invoice_service.create_order(values);
      if (response.status === 201) {
        console.log("response in order page", response);
        showModal("success", "Order Copy Generated", () => {
          clearProducts();
          setFormKey((t) => t + 1);
          console.log("response in  orderpage", response);
          router.replace({
            pathname: "/invoice/invoicepage",
            params: {
              url: response.data.data,
            },
          });
        });
        clearCustomer();
        console.log("created");
      }
    } catch (error: any) {
      console.log("error", error);
      showModal("error", error.message);
    }
  };

  return (
    <View className="p-8" style={{ flex: 1 }}>
      {/* <Header title="Order" /> */}
      <HeaderBackButton
        onPress={() => {
          clearProducts();
          // prefer navigation.goBack if available:
          if ((navigation as any)?.canGoBack?.()) {
            (navigation as any).goBack();
          } else {
            router.back();
          }
        }}
      />

      <View
        className="border-2 border-primary p-6  rounded-2xl"
        style={{ flex: 1 }}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            // justifyContent: "center",
            // alignItems: "center",
            // padding: 32,
          }}
          enableOnAndroid={true}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
        >
          <OrderForm
            key={formKey}
            initialValues={{ products: products }}
            buttonName="Generate Order Copy"
            onSubmit={(values) => handelSubmit(values)}
          />
        </KeyboardAwareScrollView>
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

export default orderpage;

const styles = StyleSheet.create({});
