import { create } from "zustand";

interface Products {
  product_id: string;
  productName: string;
  price: number;
  imageUrl?: any;
  quantity: number;
  total_amount: number;

  discount_in_percentage?: number;
  discount_in_rupees?: number;
}

interface ProductState {
  products: Products[];
  addProduct: (product: Products) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Products | undefined;
  editProduct: (updatedProduct: Products) => void;
  clearProducts: () => void;
}

export const useProductState = create<ProductState>((set, get) => ({
  products: [],

  addProduct: (product: Products) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  deleteProduct: (id: string) =>
    set((state) => ({
      products: state.products.filter((p) => p.product_id !== id),
    })),

  getProductById: (id: string) => {
    return get().products.find((p) => p.product_id === id);
  },

  editProduct: (updatedProduct: Products) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.product_id == updatedProduct.product_id ? updatedProduct : p
      ),
    }));
  },

  setProducts: (products: Products[]) => set({ products }), // ✅ replace
  clearProducts: () => set({ products: [] }),
}));
