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
    return handleApiResponse(api.post("/customer/", formValues));
  };

  // get_all_customers = async () => {
  //   return handleApiResponse(api.get("/customer/"));
  // };
  get_all_customers = async ({ page = 1, limit = 5, q = "" } = {}) => {
    const params: any = { page, limit };
    if (q && q.trim()) params.q = q;
    return handleApiResponse(api.get("/customer/", { params }));
  };

  get_mcn_number = async () => {
    return handleApiResponse(api.get("/customer/show_mcn_number"));
  };
}

export default new CustomerServices();
