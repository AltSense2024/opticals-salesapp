import { handleApiResponse } from "@/utils/handleApiResponse";
import api from "./apiServices";

interface CustomerFormValues {
  salesperson_id: string;
  mcnNumber: string;
  name: string;
  contact_number: string;
  place: string;
  age: string;
  address: string;
  reference: string;
  family_references: string;
}

class CustomerServices {
  create_customer = async (formValues: CustomerFormValues) => {
    return handleApiResponse(api.post("/customer/create_customer", formValues));
  };

  get_all_customers = async () => {
    return handleApiResponse(api.get("/customer/get_all_customers"));
  };
}

export default new CustomerServices();
