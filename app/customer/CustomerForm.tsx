import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import Input from "@/components/Input";
import customer_services from "@/services/customer_services";
import { useFocusEffect } from "expo-router";
import { CustomerDetailsForm, customerFormSchema } from "./CustomerFormSchema";

interface CustomerFormValues {
  mcnNumber: string;
  name: string;
  contact_number: string;
  alternate_contact_number: string;
  place: string;
  age: string;
  address: string;
  reference: string;
  family_references: string;
}

interface CustomerProps {
  initialValues?: CustomerFormValues;
  onSubmit: (values: CustomerFormValues) => void;
  buttonName: string;
}

const CustomerForm: React.FC<CustomerProps> = ({
  initialValues,
  onSubmit,
  buttonName,
}) => {
  const defaultValues: CustomerFormValues = {
    mcnNumber: "",
    name: "",
    contact_number: "",
    alternate_contact_number: "",
    place: "chennia",
    age: "23",
    address: "",
    reference: "",
    family_references: "",
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: initialValues || defaultValues,
  });
  useFocusEffect(
    useCallback(() => {
      const set_mcn_number = async () => {
        try {
          const response = await customer_services.get_mcn_number();
          if (response.status === 200) {
            console.log("response", response);
            setValue("mcnNumber", response.data.mcn);
          }
        } catch (error) {
          console.error("Failed to fetch MCN number", error);
        }
      };

      set_mcn_number();
    }, [setValue])
  );

  return (
    <View style={{ flex: 1, margin: 4 }}>
      {CustomerDetailsForm.map((field, index) => {
        if (field.key === "contact_number") {
          return (
            <React.Fragment key={index}>
              {/* Phone Number */}
              <View className="mb-2">
                <Controller
                  control={control}
                  name="contact_number"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={field.placeholder}
                      onChangeText={onChange}
                      value={value}
                      label={field.name}
                      error={errors.contact_number?.message}
                    />
                  )}
                />
              </View>

              {/* Place + Age row */}
              <View className="flex-row mb-2 w-full">
                <View className="flex-[3] mr-2">
                  <Controller
                    control={control}
                    name="place"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Enter place"
                        onChangeText={onChange}
                        value={value}
                        label="Place"
                        error={errors.place?.message}
                      />
                    )}
                  />
                </View>
                <View className="flex-[2]">
                  <Controller
                    control={control}
                    name="age"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Enter age"
                        onChangeText={onChange}
                        value={value}
                        label="Age"
                        error={errors.age?.message}
                      />
                    )}
                  />
                </View>
              </View>
            </React.Fragment>
          );
        }

        // default render
        return (
          <View key={index} className="mb-2">
            <Controller
              control={control}
              name={field.key as keyof CustomerFormValues}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={field.placeholder}
                  onChangeText={onChange}
                  value={value}
                  label={field.name}
                  error={errors[field.key as keyof CustomerFormValues]?.message}
                />
              )}
            />
          </View>
        );
      })}

      <Button name={buttonName} onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default CustomerForm;

const styles = StyleSheet.create({});
