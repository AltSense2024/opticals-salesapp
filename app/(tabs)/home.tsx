import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import Poster from "../../assets/poster.svg";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import invoice_service from "@/services/invoice_service";
import InvoiceCard from "@/components/InvoiceCard";
import { useCustomerState } from "@/stores/CustomerStore";
import { useProductState } from "@/stores/OrderFormProductsStore";

interface Invoice {
  id: string;
  date: string;
  doc_number: string;
  customer_name: string;
  total_amount: number;
}

export default function Home() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOrders, setShowOrders] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const listRef = useRef<FlatList<any>>(null);

  const { clearCustomer } = useCustomerState();
  const { clearProducts } = useProductState();

  // Normalize responses from backend
  const normalizePayload = (res: any): any[] => {
    const payload =
      res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? res ?? {};
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  };

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await invoice_service.get_all_today_orders(user?.id ?? "");
      const items = normalizePayload(res);
      const normalized: Invoice[] = items.map((it: any) => ({
        id: String(it.id ?? it._id ?? it.doc_id ?? Math.random()),
        date: it.date,
        doc_number: it.doc_number ?? it.docNumber ?? it.document_number ?? "",
        customer_name:
          it.customer_name ?? it.customer?.name ?? it.name ?? "Unknown",
        total_amount: Number(it.total_amount ?? it.total ?? it.amount ?? 0),
      }));
      setInvoices(normalized);
    } catch (err: any) {
      console.error("fetchOrders error", err);
      setError(err?.message ?? "Failed to load orders");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);




  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  

  const filtered = useMemo(() => {
    if (!search.trim()) return invoices;
    const s = search.toLowerCase();
    return invoices.filter(
      (inv) =>
        (inv.customer_name ?? "").toLowerCase().includes(s) ||
        (inv.doc_number ?? "").toLowerCase().includes(s)
    );
  }, [invoices, search]);

  const openOrders = async () => {
    await fetchOrders();
    setShowOrders(true);

    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 200);
  };

  return (
    <FlatList
      ref={listRef}
      data={showOrders ? filtered : []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
          <InvoiceCard
            id={item.id}
            invoiceNumber={item.doc_number}
            date={item.date}
            name={item.customer_name}
            amount={item.total_amount}
          />
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <View
          style={[
            styles.container,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={styles.greeting}>
              Hello, {user?.username ?? "User"}
            </Text>

            <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.posterWrap}>
            <Poster width="100%" height={160} />
          </View>

          {/* ---- Buttons Row ---- */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                clearCustomer();
                router.push("/prescription/prescription");
              }}
            >
              <Text style={styles.primaryBtnText}>Prescription</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={openOrders}>
              <Text style={styles.secondaryBtnText}>Recent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                clearCustomer();
                clearProducts();
                router.push("/order/orderpage");
              }}
            >
              <Text style={styles.primaryBtnText}>Order Form</Text>
            </TouchableOpacity>
          </View>

          {/* Add Sale Button */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/add_customer")}
            style={styles.addSaleBtn}
          >
            <Text style={styles.addSaleText}>Add New Sale</Text>
          </TouchableOpacity>

          {/* Orders Search + Title */}
          {showOrders && (
            <View style={{ marginTop: 18 }}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>

              <TextInput
                placeholder="Search by customer or invoice #"
                placeholderTextColor="#666"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>
          )}

          {loading && (
            <View style={{ padding: 24 }}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        showOrders && !loading ? (
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text style={{ color: "#666" }}>
              {error ? error : "No orders found"}
            </Text>
          </View>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 120 }}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 18 },
  greeting: { fontSize: 24, fontWeight: "700", color: "#000" },
  posterWrap: { width: "100%", paddingVertical: 12 },
  buttonsRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#491B6D",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#491B6D",
  },
  secondaryBtnText: { color: "#491B6D", fontWeight: "700" },
  addSaleBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  addSaleText: { color: "#fff", fontWeight: "700" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#491B6D",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ef4444",
    borderRadius: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
