import { create } from "zustand";

interface PrescriptionState {
  prescriptionId: string | null;
  addPrescription: (id: string) => void;
}

export const usePrescriptionState = create<PrescriptionState>((set) => ({
  prescriptionId: null,
  addPrescription: (id) => set({ prescriptionId: id }),
}));
