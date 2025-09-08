import { PrescriptionFormValues } from "@/app/prescription/PrescriptionForm";
import { handleApiResponse } from "@/utils/handleApiResponse";
import api from "./apiServices";

class PrescriptionServices {
  create_prescription = async (values: PrescriptionFormValues) => {
    return handleApiResponse(
      api.post("/prescription/create_prescription", values)
    );
  };
}

export default new PrescriptionServices();
