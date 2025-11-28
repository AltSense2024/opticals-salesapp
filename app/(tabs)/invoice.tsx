// import CustomHeader from "@/components/Header";
// import Input from "@/components/Input";
// import InvoiceCard from "@/components/InvoiceCard";
// import invoice_service from "@/services/invoice_service";
// import { useFocusEffect } from "expo-router";
// import React, { useCallback, useState } from "react";
// import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

// interface Invoice {
//   id: string;
//   date: string;
//   doc_number: string;
//   customer_id: string;
//   total_amount: number;
//   customer_name: string;
// }

// const InvoiceScreen = () => {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const getOrders = async () => {
//     try {
//       const response = await invoice_service.get_all_orders();
//       console.log("response", response.data.data.data);
//       if (response.status === 200) {
//         setInvoices(response.data.data.data);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       getOrders();
//     }, [])
//   );

//   // pull-to-refresh handler
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await getOrders();
//     setRefreshing(false);
//   }, []);

//   return (
//     <View className="p-8 flex-1">
//       <CustomHeader title={""} />
//       <Text className="font-extrabold text-[24px] text-primary">
//         Order Copy History
//       </Text>

//       <Input
//         label=""
//         placeholder="Search"
//         onChangeText={(text) => {
//           // you can add search logic here
//           console.log("Search text:", text);
//         }}
//         value={undefined}
//         className="rounded-2xl my-2"
//       />

//       <FlatList
//         data={invoices}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View className="py-2">
//             <InvoiceCard
//               invoiceNumber={item.doc_number}
//               date={item.date}
//               name={item.customer_name.name}
//               amount={item.total_amount}
//               id={item.id}
//             />

//           </View>
//         )}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />
//     </View>
//   );
// };

// export default InvoiceScreen;

// const styles = StyleSheet.create({});
import CustomHeader from "@/components/Header";
import Input from "@/components/Input";
import InvoiceCard from "@/components/InvoiceCard";
import invoice_service from "@/services/invoice_service";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

interface Invoice {
  id: string;
  date: string;
  doc_number: string;
  customer_id?: string;
  total_amount: number;
  customer_name?: any;
}

const DEFAULT_PER_PAGE = 25;

const InvoiceScreen = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false); // initial load
  const [loadingMore, setLoadingMore] = useState(false); // pagination load
  const [page, setPage] = useState(1);
  const [perPage] = useState(DEFAULT_PER_PAGE);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const searchRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: robustly extract list and meta from different response shapes
  const normalizeResponse = (res: any) => {
    // items may be in res.data.data.data or res.data.data or res.data
    const root = res?.data ?? res;
    let items: any[] = [];
    let meta: any = null;

    if (Array.isArray(root)) {
      items = root;
    } else if (Array.isArray(root?.data?.data)) {
      items = root.data.data;
      meta = root.data.meta ?? root.meta;
    } else if (Array.isArray(root?.data)) {
      items = root.data;
      meta = root.meta ?? root.data.meta;
    } else if (Array.isArray(root?.items)) {
      items = root.items;
      meta = root.meta ?? root.items?.meta;
    } else if (Array.isArray(root?.data?.items)) {
      items = root.data.items;
      meta = root.data.meta ?? root.data.items.meta;
    } else if (Array.isArray(root?.data?.data?.items)) {
      items = root.data.data.items;
      meta = root.data.data.meta ?? root.data.meta;
    } else if (Array.isArray(root?.data?.data)) {
      items = root.data.data;
      meta = root.data.meta ?? root.meta;
    } else {
      // last resort: try to find first array inside object
      const found = Object.values(root).find((v) => Array.isArray(v));
      items = (found as any[]) ?? [];
      meta = root.meta ?? null;
    }

    return { items, meta };
  };

  const getOrders = useCallback(
    async (opts?: { page?: number; replace?: boolean; q?: string }) => {
      const p = opts?.page ?? page;
      const replace = opts?.replace ?? false;
      const q = opts?.q ?? search;

      try {
        if (p === 1 && !replace) {
          setLoading(true);
        } else if (opts?.page === 1 && replace) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const res = await invoice_service.get_all_orders({
          page: p,
          per_page: perPage,
          q: q && q.length > 0 ? q : undefined,
        });

        const { items, meta } = normalizeResponse(res);

        // Map items to your Invoice shape if needed (defensive)
        const mapped: Invoice[] = (items || []).map((it: any) => ({
          id: String(
            it.id ??
              it._id ??
              it.doc_id ??
              it.doc_number ??
              Math.random().toString()
          ),
          date: it.date ,
          doc_number: it.doc_number ?? it.docNumber ?? it.document_number ?? "",
          customer_id: it.customer_id ?? it.customer?.id ?? it.customer?._id,
          total_amount: Number(it.total_amount ?? it.total ?? it.amount ?? 0),
          customer_name:
            it.customer_name ?? it.customer ?? it.name ?? it.customer?.name,
        }));

        if (p === 1 || replace) {
          setInvoices(mapped);
        } else {
          setInvoices((prev) => [...prev, ...mapped]);
        }

        // Determine if more pages exist. Prefer server meta, otherwise infer from returned count.
        if (meta) {
          // try common meta shapes: { page, per_page, total, total_pages }
          const currentPage = Number(meta.page ?? meta.current_page ?? p);
          const totalPages = Number(
            meta.total_pages ??
              meta.totalPages ??
              Math.ceil((meta.total ?? 0) / (meta.per_page ?? perPage))
          );
          setPage(currentPage);
          setHasMore(currentPage < totalPages);
        } else {
          // fallback heuristic: if returned count < perPage, no more.
          setHasMore((mapped.length ?? 0) >= perPage);
          setPage(p);
        }
      } catch (error) {
        console.warn("Failed to load invoices", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [page, perPage, search]
  );

  // initial load on screen focus
  useFocusEffect(
    useCallback(() => {
      // reset page & load first page
      setPage(1);
      setHasMore(true);
      void getOrders({ page: 1, replace: true, q: search });
    }, [getOrders])
  );

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await getOrders({ page: 1, replace: true, q: search });
    setRefreshing(false);
  }, [getOrders, search]);

  // Load next page (infinite scroll)
  const loadMore = useCallback(() => {
    if (loadingMore || loading) return;
    if (!hasMore) return;
    const next = page + 1;
    void getOrders({ page: next, replace: false, q: search });
  }, [getOrders, page, hasMore, loadingMore, loading, search]);

  // Debounced search handler
  const onSearchChange = (text: string) => {
    setSearch(text);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      // when search changes, reset to first page and fetch with replace: true
      setPage(1);
      setHasMore(true);
      void getOrders({ page: 1, replace: true, q: text });
    }, 500);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 12 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const ListEmpty = () => {
    if (loading) {
      return (
        <View style={{ padding: 24 }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#666" }}>No orders found</Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.inner}>
        <CustomHeader title={""} />
        <Text style={styles.title}>Order Copy History</Text>

        <Input
          label=""
          placeholder="Search by customer or invoice #"
          onChangeText={onSearchChange}
          value={search}
          className="rounded-2xl my-2"
        />

        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="py-2">
              <InvoiceCard
                invoiceNumber={item.doc_number}
                date={item.date}
                name={item.customer_name?.name ?? item.customer_name ?? "-"}
                amount={item.total_amount}
                id={item.id}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            loadMore();
          }}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={ListEmpty}
        />
      </View>
    </View>
  );
};

export default InvoiceScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  inner: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#491B6D",
    marginBottom: 8,
  },
});
