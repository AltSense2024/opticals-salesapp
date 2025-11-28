import { useAuth } from "@/context/authContext";
import invoice_service from "@/services/invoice_service";
import { useCustomerState } from "@/stores/CustomerStore";
import { useProductState } from "@/stores/OrderFormProductsStore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomHeader from "@/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OrderForm, { OrderFormValues, round2 } from "./OrderForm";
import { useApiResponseHandle } from "@/hooks/useApiResponseHandle";
import SuccessAndErrorModal from "@/components/SuccessAndErrorModal";
import Button from "@/components/Button";

const OrderPageId = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { addProduct, products, setProducts, clearProducts } =
    useProductState();

  const [isPaymentReceived, setIsPaymentReceived] = useState("");
  const { user } = useAuth();
  const { addCustomer } = useCustomerState();
  const { status, message, open, setOpen, onPress, showModal } =
    useApiResponseHandle();
  const [initialValues, setInitialValues] = useState<Partial<OrderFormValues>>({
    // customerName: "",
    // contactNumber: "",
    products: [],
    // flat_discount: 0,
    advance_amount: 0,
    total_amount: 0,
    payments: [],
    // payment_status: "",
  });

  const get_invoice_by_id = async () => {
    try {
      const response = await invoice_service.get_order_by_id(id);
      console.log("response", response);
      if (response.status === 200) {
        const invoiceData = response.data.data;
        console.log("invoiceData", invoiceData);
        const mappedProducts = invoiceData.items.map((item: any) => ({
          product_id: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          discount_in_percentage: item.discount_in_percentage,
          discount_in_rupees: item.discount_in_rupees,
          total_amount: item.total_amount,
        }));

        const mappedPayments = invoiceData.payments.map((payment: any) => ({
          amount_paid: payment.amount,
          payment_mode: payment.mode,
        }));
        console.log("mappedPayments", mappedPayments);
        setProducts(mappedProducts);
        addCustomer(invoiceData.customer);
        setInitialValues({
          customer_id: invoiceData.customer.id,
          discount_in_rupees: round2(
            invoiceData.total_amount *
              (invoiceData.discount_in_percentage / 100)
          ),
          discount_in_percentage: invoiceData.discount_in_percentage || 0,
          advance_amount: invoiceData.advance_amount || 0,
          // total_amount: invoiceData.total_amount || 0,
          // payment_mode: invoiceData.payment_mode || "",
          // payment_status: invoiceData.payment_status ?? false,
          payments: mappedPayments,
          estimate_delivery_date: invoiceData.estimate_delivery_date,
        });

        setIsPaymentReceived(invoiceData.payment_status);
      }
    } catch (error) {
      console.error("something went wrong", error);
    }
  };
  console.log("isPaymentReceived", isPaymentReceived);
  const handleSubmit = async (values: any, doc_type: string) => {
    try {
      console.log("calling");
      showModal("loading", "");
      const formValues = {
        ...values,
        doc_type,

        salesperson_id: user?.id,
      };

      const response = await invoice_service.update_order(id, formValues);
      console.log("fromValues", formValues);
      if (response.status == 200) {
        console.log("response in id", response);
        showModal(
          "success",
          "Order Copy Updated",
          () => {
            setOpen(false);
          },
          1000
        );
      }
    } catch (error: any) {
      console.log("error", error);
      showModal("error", error.message);
    }
  };

  const handleInvoiceGenerate = async (id: string) => {
    try {
      showModal("loading", "");
      const response =
        await invoice_service.generate_invoice_using_order_id(id);

      if (response.status == 201) {
        showModal("success", "Invoice Copy Generated", () => {
          useRouter().push({
            pathname: "/invoice/invoicepage",
            params: {
              url: response.data.invoice_url,
            },
          });
        });
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    get_invoice_by_id();
  }, []);

  return (
    <View className="p-8 " style={{ flex: 1 }}>
      <CustomHeader title="Order Form" />

      <View
        className="border-2 border-primary p-6 rounded-2xl "
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
            initialValues={{ ...initialValues, products: products }}
            buttonName="Update Order Copy"
            onSubmit={(values) => handleSubmit(values, "order")}
          />
        </KeyboardAwareScrollView>
        {isPaymentReceived === "PAID" && (
          <TouchableOpacity
            onPress={() => handleInvoiceGenerate(id)}
            className="items-center border border-primary bg-primary rounded-2xl p-3 mt-3"
          >
            <Text className="text-white font-semibold">
              Generate Invoice Copy
            </Text>
          </TouchableOpacity>
        )}
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

export default OrderPageId;

const styles = StyleSheet.create({});
