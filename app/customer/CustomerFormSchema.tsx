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
    name: "Alternate Phone Number",
    key: "alternate_contact_number",
    type: "number",
    placeholder: "Enter Alternate phone number",
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

import { z } from "zod";

// 1. Customer form validation schema
export const customerFormSchema = z.object({
  mcnNumber: z
    .string()
    .min(1, "MCN Number is required")
    .max(20, "MCN Number must be less than 20 characters"),
  name: z.string().min(1, "Name is required"),
  contact_number: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must be less than 15 digits"),

  place: z.string().optional(),
  age: z
    .string()
    .refine(
      (val) => !val || /^[0-9]+$/.test(val),
      "Age must be a valid number"
    ),
  address: z.string().optional(),
  reference: z.string().optional(),
  family_references: z.string().optional(),
});

// 2. Type inference
export type CustomerFormValues = z.infer<typeof customerFormSchema>;
