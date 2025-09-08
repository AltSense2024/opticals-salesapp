import customer_services from "@/services/customer_services";
import { create } from "zustand";

interface Customer {
  id: string;
  name: string;
  contact_number: string;
  place: string;
  family_references: string;
}

interface CustomerState {
  customers: Customer[];
  customer: Customer | null;
  setCustomers: (list: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  fetchCustomers: () => Promise<void>; // fetch from API
}

export const useCustomerState = create<CustomerState>((set) => ({
  customers: [],
  customer: null,

  setCustomers: (list) => set({ customers: list }),
  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, customer],
      customer: customer,
    })),

  // fetch all customers from API
  fetchCustomers: async () => {
    try {
      const res = await customer_services.get_all_customers();
      if (res.status === 200) {
        set({ customers: res.data });

        set((state) => ({
          customer: state.customer ?? res.data[0],
        }));
      }
    } catch (err) {
      console.log("Failed to fetch customers", err);
    }
  },
}));
