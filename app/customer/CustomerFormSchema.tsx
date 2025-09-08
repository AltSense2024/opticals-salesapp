import * as Yup from "yup";

export const CustomerDetailsForm = [
  {
    name: "MCN Number",
    key: "mcnNumber",
    type: "text",
    placeholder: "Enter MCN number",
    required: true,
  },
  {
    name: "Customer Name",
    key: "name",
    type: "text",
    placeholder: "Enter customer name",
    required: true,
  },
  {
    name: "Phone Number",
    key: "contact_number",
    type: "number",
    placeholder: "Enter phone number",
    required: true,
  },

  {
    name: "Address",
    key: "address",
    type: "text",
    placeholder: "Enter Address",
    required: true,
  },
  {
    name: "Reference",
    key: "reference",
    type: "text",
    placeholder: "Enter Reference",
    required: true,
  },
  {
    name: "Family",
    key: "family_references",
    type: "text",
    placeholder: "Enter Family Reference",
    required: true,
  },
];

export const customerFormValidation = Yup.object().shape({
  // mcn_number: Yup.string()
  //   .required("MCN Number is required")
  //   .matches(/^[0-9]+$/, "MCN Number must be numeric"),
  // customer_name: Yup.string()
  //   .required("Customer Name is required")
  //   .min(2, "Too short"),
  contact_number: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
});
