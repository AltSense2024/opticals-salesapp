import { handleApiResponse } from "@/utils/handleApiResponse";
import api from "./apiServices";

class InvoiceService {
  create_order = async (formValues: any) => {
    return handleApiResponse(api.post("/invoice/create_order", formValues));
  };

  get_all_orders = async ({ page = 1, per_page = 25, q = "" } = {}) => {
    const params: any = { page, per_page };
    if (q && q.trim()) params.q = q;

    return handleApiResponse(
      api.get("/invoice/get_all_orders", {
        params,
      })
    );
  };

  get_all_today_orders = async (id: string) => {
    return handleApiResponse(api.get(`/invoice/get_all_today_order/${id}`));
  };

  get_order_by_id = async (id: string) => {
    return handleApiResponse(api.get(`/invoice/get_order_by_id/${id}`));
  };

  update_order = async (id: string, values: any) => {
    return handleApiResponse(api.patch(`/invoice/update_order/${id}`, values));
  };

  generate_invoice_using_order_id = async (id: string) => {
    return handleApiResponse(
      api.post(`/invoice/create_invoice_using_order/${id}`)
    );
  };
}

export default new InvoiceService();
