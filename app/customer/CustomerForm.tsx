import { Formik } from "formik";
import { StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import Input from "@/components/Input";
import React from "react";
import {
  CustomerDetailsForm,
  customerFormValidation,
} from "./CustomerFormSchema";

interface CustomerFormValues {
  mcnNumber: string;
  name: string;
  contact_number: string;
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
    place: "",
    age: "",
    address: "",
    reference: "",
    family_references: "",
  };

  return (
    <Formik
      initialValues={initialValues || defaultValues}
      validationSchema={customerFormValidation}
      onSubmit={onSubmit || (() => {})}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View>
          {CustomerDetailsForm.map((field, index) => {
            if (field.key === "contact_number") {
              return (
                <React.Fragment key={index}>
                  {/* render Phone Number normally */}
                  <View className="mb-2">
                    <Input
                      placeholder={field.placeholder}
                      onChangeText={handleChange("contact_number")}
                      value={values.contact_number}
                      label={field.name}
                    />
                  </View>

                  {/* after phone_number, render Place + Age row */}
                  <View className="flex-row mb-2 w-full ">
                    <View className="flex-[3] mr-2">
                      <Input
                        placeholder="Enter place"
                        onChangeText={handleChange("place")}
                        value={values.place}
                        label="Place"
                      />
                    </View>
                    <View className="flex-[2]">
                      <Input
                        placeholder="Enter age"
                        onChangeText={handleChange("age")}
                        value={values.age}
                        label="Age"
                      />
                    </View>
                  </View>
                </React.Fragment>
              );
            }

            // default render for other fields
            return (
              <View key={index} className="mb-2">
                <Input
                  placeholder={field.placeholder}
                  onChangeText={handleChange(field.key)}
                  value={values[field.key as keyof CustomerFormValues]}
                  label={field.name}
                />
              </View>
            );
          })}
          <Button name={buttonName} onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};

export default CustomerForm;

const styles = StyleSheet.create({});
