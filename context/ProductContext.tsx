// import React, { createContext, useContext, useState, ReactNode } from "react";
// import api from "@/services/apiServices";

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   imageUrl?: string;
//   discountPrice?: number;
// }

// interface ProductContextType {
//   products: Product[];
//   fetchProducts: () => Promise<void>;
// }

// const ProductContext = createContext<ProductContextType | undefined>(undefined);

// export const ProductProvider = ({ children }: { children: ReactNode }) => {
//   const [products, setProducts] = useState<Product[]>([]);

//   const fetchProducts = async () => {
//     try {
//       const response = await api.get("/products/");
//       if (response.status === 200) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.log("❌ Failed to fetch products", error);
//     }
//   };

//   return (
//     <ProductContext.Provider value={{ products, fetchProducts }}>
//       {children}
//     </ProductContext.Provider>
//   );
// };

// // ✅ Custom hook for using context
// export const useProductContext = () => {
//   const context = useContext(ProductContext);
//   if (!context) {
//     throw new Error("useProductContext must be used within a ProductProvider");
//   }
//   return context;
// };
// ProductContext.tsx (replacement - stable functions + memoized value)
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import api from "@/services/apiServices";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  discountPrice?: number;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  page: number;
  limit: number;
  hasMore: boolean;
  fetchProducts: (opts?: {
    page?: number;
    limit?: number;
    q?: string;
    replace?: boolean;
  }) => Promise<void>;
  fetchMoreProducts: (q?: string) => Promise<void>;
  resetProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // default as your backend expects
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(
    async (opts?: {
      page?: number;
      limit?: number;
      q?: string;
      replace?: boolean;
    }) => {
      const p = opts?.page ?? 1;
      const lim = opts?.limit ?? limit;
      const q = opts?.q ?? undefined;
      const replace = opts?.replace ?? p === 1;

      try {
        if (p === 1) setLoading(true);
        else setLoadingMore(true);

        const params: any = { page: p, limit: lim };
        if (q && q.trim()) params.q = q;

        // call backend that returns { status, data, meta }
        const res = await api.get("/products", { params });

        const root = res?.data ?? res;
        const items = Array.isArray(root?.data)
          ? root.data
          : Array.isArray(root)
            ? root
            : (root?.items ?? []);

        // map to Product shape
        const mapped = (items || []).map((it: any) => ({
          id: String(
            it.id ??
              it._id ??
              it.product_id ??
              it.sku ??
              Math.random().toString()
          ),
          name: it.name ?? it.title ?? "",
          description: it.description ?? "",
          price: Number(it.price ?? it.amount ?? 0),
          stock: Number(it.stock ?? it.qty ?? 0),
          imageUrl: it.imageUrl ?? it.image_url ?? it.image ?? "",
          discountPrice: it.discountPrice ?? it.discount_price ?? undefined,
        }));

        if (replace) setProducts(mapped);
        else setProducts((prev) => [...prev, ...mapped]);

        // meta expected from backend: { page, limit, total, total_pages }
        const meta = root?.meta ?? null;
        if (meta) {
          const currentPage = Number(meta.page ?? p);
          const totalPages = Number(
            meta.total_pages ??
              Math.ceil((meta.total ?? 0) / (meta.limit ?? lim))
          );
          setPage(currentPage);
          setHasMore(currentPage < totalPages);
        } else {
          setPage(p);
          setHasMore((mapped.length ?? 0) >= lim);
        }
      } catch (err) {
        console.warn("fetchProducts error", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [limit]
  );

  const fetchMoreProducts = useCallback(
    async (q?: string) => {
      if (!hasMore || loadingMore) return;
      await fetchProducts({ page: page + 1, limit, q, replace: false });
    },
    [hasMore, loadingMore, fetchProducts, page, limit]
  );

  const resetProducts = useCallback(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, []);

  const ctx = useMemo(
    () => ({
      products,
      loading,
      loadingMore,
      page,
      limit,
      hasMore,
      fetchProducts,
      fetchMoreProducts,
      resetProducts,
    }),
    [
      products,
      loading,
      loadingMore,
      page,
      limit,
      hasMore,
      fetchProducts,
      fetchMoreProducts,
      resetProducts,
    ]
  );

  return (
    <ProductContext.Provider value={ctx}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProductContext must be used within a ProductProvider");
  return context;
};
