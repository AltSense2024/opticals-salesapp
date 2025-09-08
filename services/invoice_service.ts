import { handleApiResponse } from "@/utils/handleApiResponse";
import api from "./apiServices";

class InvoiceService {
  create_invoice = async (formValues: any) => {
    return handleApiResponse(api.post("/invoice/create_invoice", formValues));
  };

  get_all_invoices = async () => {
    return handleApiResponse(api.get("/invoice/get_all_invoices"));
  };

  get_invoice_by_id = async (id: string) => {
    return handleApiResponse(api.get(`/invoice/get_invoice_by_id/${id}`));
  };

  update_invoice = async (id: string, values: any) => {
    return handleApiResponse(
      api.patch(`/invoice/update_invoice/${id}`, values)
    );
  };
}

export default new InvoiceService();
