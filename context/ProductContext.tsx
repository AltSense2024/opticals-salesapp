import React, { createContext, useContext, useState, ReactNode } from "react";
import api from "@/services/apiServices";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  discountPrice?: number;
}

interface ProductContextType {
  products: Product[];
  fetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/product/get_all_products");
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log("❌ Failed to fetch products", error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

// ✅ Custom hook for using context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
