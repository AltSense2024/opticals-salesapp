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
  clearCustomer: () => void;
  fetchCustomers: (options?: {
    page?: number;
    limit?: number;
    q?: string;
    replace?: boolean;
  }) => Promise<{ items: any; meta: any } | undefined>; // fetch from API
}

export const useCustomerState = create<CustomerState>((set, get) => ({
  customers: [],
  customer: null,

  setCustomers: (list) => set({ customers: list }),
  addCustomer: (customer) =>
    set((state) => {
      const exists = state.customers.some((c) => c.id === customer.id);
      return {
        customers: exists ? state.customers : [...state.customers, customer],
        customer: customer,
      };
    }),

  clearCustomer: () => set({ customer: null }),

  // fetchCustomers: async () => {
  //   try {
  //     const res = await customer_services.get_all_customers();

  //     if (res.status === 200) {
  //       set((state) => {
  //         const fetchedCustomers = res.data.data;
  //         const seenIds = new Set<string>();

  //         const dedupedCustomers = [...fetchedCustomers, state.customer]
  //           .filter((c: Customer | null) => {
  //             if (!c || seenIds.has(c.id)) return false;
  //             seenIds.add(c.id);
  //             return true;
  //           });

  //         return {
  //           customers: dedupedCustomers,
  //           // customer: state.customer || dedupedCustomers[0]
  //         };
  //       });
  //     }
  //   } catch (err) {
  //     console.log("Failed to fetch customers", err);
  //   }
  // },
  // stores/CustomerStore.ts (inside create(...) replace fetchCustomers)
  fetchCustomers: async ({
    page = 1,
    limit = 10,
    q = "",
    replace = page === 1,
  } = {}) => {
    try {
      const res = await customer_services.get_all_customers({ page, limit, q });

      if (res.status === 200) {
        // backend returns { status, data, meta } per your endpoint
        const items = res.data?.data ?? []; // array
        const meta = res.data?.meta ?? null;

        set((state) => {
          // map items to desired shape if needed
          const mapped = (items || []).map((it: any) => ({
            id: String(it.id ?? it._id ?? it.customer_id ?? it._id),
            name: it.name ?? it.full_name ?? "",
            contact_number: it.contact_number ?? it.phone ?? it.mobile ?? "",
            place: it.place ?? "",
            family_references: it.family_references ?? "",
          }));

          const nextList = replace
            ? mapped
            : [...(state.customers || []), ...mapped];

          // de-duplicate by id while preserving order
          const seen = new Set<string>();
          const deduped = nextList.filter((c) => {
            if (!c || seen.has(c.id)) return false;
            seen.add(c.id);
            return true;
          });

          return {
            customers: deduped,
            // preserve currently selected customer; DO NOT auto-select
          };
        });

        // Optionally return meta for caller
        return { items: items, meta };
      }
    } catch (err) {
      console.warn("Failed to fetch customers", err);
      throw err;
    }
  },
  // add helper to fetch next page (optional)
  fetchMoreCustomers: async ({ page = 2, limit = 10, q = "" } = {}) => {
    // simply call fetchCustomers with replace=false
    await get().fetchCustomers({ page, limit, q, replace: false });
  },
  
}));
