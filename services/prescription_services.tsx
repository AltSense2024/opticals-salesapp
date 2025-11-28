import { PrescriptionFormValues } from "@/app/prescription/PrescriptionForm";
import { handleApiResponse } from "@/utils/handleApiResponse";
import api from "./apiServices";

class PrescriptionServices {
  create_prescription = async (values: PrescriptionFormValues) => {
    return handleApiResponse(
      api.post("/prescription/", values)
    );
  };

  get_prescription_by_id = async (id: string) => {
    return handleApiResponse(
      api.get(`/prescription/get_prescription_by_id/${id}`)
    );
  };

  update_prescription = async (id: string,formValues:PrescriptionFormValues) => {
    return handleApiResponse(
      api.patch(`/prescription/update_prescription/${id}`, formValues)
    );
  };
}

export default new PrescriptionServices();
