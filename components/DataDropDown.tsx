// import React, { useState } from "react";
// import {
//   Modal,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// interface DataDropDownProps {
//   data: any[];
//   label: string;
//   value: string | null | number | boolean;
//   onSelect: (value: string) => void;
// }

// const DataDropDown: React.FC<DataDropDownProps> = ({
//   data,
//   label,
//   value,
//   onSelect,
// }) => {
//   const [openDropDown, setOpenDropDown] = useState<boolean>(false);
//   const [searchText, setSearchText] = useState<string>("");

//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   // console.log("data in dropdown", data);
//   // filter data based on search
//   const filteredData = Array.isArray(data)
//     ? data.filter((item) =>
//         item?.name?.toLowerCase().includes(searchText.toLowerCase())
//       )
//     : [];

//   const handleSelect = (item: string) => {
//     console.log("item", item);
//     onSelect(item); // ✅ push value to Formik
//     setOpenDropDown(false);
//     setSearchText("");
//   };

//   console.log("value", value);

//   // const selectedItem = data.find((item)=>item.id == )

//   return (
//     <View>
//       <Text className="text-lg font-semibold mb-2">{label}</Text>
//       <TouchableOpacity
//         className="border border-primary rounded-2xl p-3"
//         onPress={() => setOpen(!open)}
//       >
//         <Text className="font-bold text-primary">
//           {/* {value ? value : `Select an ${label}...`} */}
//           {value
//             ? (data.find((item) => item.id === value)?.name ?? value)
//             : `Select an ${label}...`}
//         </Text>
//       </TouchableOpacity>

//       {/* {openDropDown && (
//         <View style={styles.dropdown}>
//           <TextInput
//             placeholder="Search..."
//             value={searchText}
//             onChangeText={setSearchText}
//             className="text-primary p-3"
//           />

//           <FlatList
//             data={filteredData}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.item}
//                 onPress={() => handleSelect(item.id ? item.id : item.name)}
//               >
//                 <Text>{item?.name ?? " "}</Text>
//                 <Text>{item?.qty ?? " "}</Text>
//                 <Text>{item?.contact_number ?? " "}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       )} */}
//       <Modal visible={open} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setOpen(false)}>
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: "rgba(0,0,0,0.4)",
//               justifyContent: "center",
//               padding: 20,
//             }}
//           >
//             <TouchableWithoutFeedback>
//               <View
//                 style={{
//                   backgroundColor: "#fff",
//                   borderRadius: 12,
//                   maxHeight: 300,
//                 }}
//               >
//                 <TextInput
//                   placeholder="Search..."
//                   value={searchText}
//                   onChangeText={setSearchText}
//                   style={{
//                     padding: 12,
//                     borderBottomWidth: 1,
//                     borderColor: "#ddd",
//                   }}
//                 />

//                 <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
//                   {filteredData.map((item) => (
//                     <TouchableOpacity
//                       key={item.id}
//                       style={{
//                         padding: 12,
//                         borderBottomWidth: 1,
//                         borderColor: "#eee",
//                       }}
//                       onPress={() => {
//                         onSelect(item.id);
//                         setOpen(false); // close modal
//                         setSearchText("");
//                       }}
//                     >
//                       <View className="flex-row justify-between">
//                         <Text>{item.name}</Text>
//                         <Text>{item?.contact_number ?? " "}</Text>
//                       </View>
//                     </TouchableOpacity>
//                   ))}
//                 </KeyboardAwareScrollView>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };

// export default DataDropDown;

// const styles = StyleSheet.create({
//   dropdown: {
//     marginTop: 5,
//     borderWidth: 1,
//     borderColor: "#aaa",
//     borderRadius: 8,
//     maxHeight: 200,
//     backgroundColor: "#fff",
//   },

//   item: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
// });

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";

type ItemAny = { id?: string | number; name?: string; [k: string]: any };

interface DataDropDownProps {
  // If `data` is passed, component will use it (no remote loads).
  data?: ItemAny[];
  // Label/title to display
  label: string;
  // controlled selected value (id)
  value?: string | number | null;
  // called when user selects an id
  onSelect: (id: string | number) => void;

  // OPTIONAL: async loader for pages: (page, q, pageSize) => Promise<{ items: ItemAny[], meta?: any }>
  // If omitted and `data` is provided, remote features are disabled.
  loadPage?: (
    page: number,
    q: string,
    pageSize: number
  ) => Promise<{ items: ItemAny[]; meta?: any }>;

  // page size for remote loading
  pageSize?: number;

  // placeholder for empty selection
  placeholder?: string;

  // optional extractor to read id/name from items
  idKey?: string; // default "id"
  nameKey?: string; // default "name"
}

export default function DataDropDown({
  data,
  label,
  value,
  onSelect,
  loadPage,
  pageSize = 10,
  placeholder,
  idKey = "id",
  nameKey = "name",
}: DataDropDownProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState<ItemAny[]>(data ?? []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchRef = useRef<NodeJS.Timeout | null>(null);

  // If parent provides data prop and it changes, use it (backwards compat)
  useEffect(() => {
    if (Array.isArray(data)) {
      setItems(data);
      setHasMore(false);
    }
  }, [data]);

  // load page helper (remote)
  const doLoadPage = async (p: number, q: string, replace = false) => {
    if (!loadPage) return;
    try {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await loadPage(p, q, pageSize);
      const fetched = res?.items ?? [];
      if (replace) setItems(fetched);
      else
        setItems((prev) => {
          // dedupe by id
          const ids = new Set(prev.map((x) => String(x[idKey])));
          const toAppend = fetched.filter((f) => !ids.has(String(f[idKey])));
          return [...prev, ...toAppend];
        });

      // meta-based hasMore, else heuristic
      const meta = res?.meta;
      if (meta) {
        const currentPage = Number(meta.page ?? p);
        const totalPages = Number(
          meta.total_pages ??
            Math.ceil((meta.total ?? 0) / (meta.per_page ?? pageSize))
        );
        setHasMore(currentPage < totalPages);
      } else {
        setHasMore(fetched.length >= pageSize);
      }
    } catch (err) {
      console.warn("DataDropDown loadPage error", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // open modal -> load first page (if remote)
  useEffect(() => {
    if (!open) return;
    setPage(1);
    if (loadPage) {
      void doLoadPage(1, "", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // debounced search (remote)
  useEffect(() => {
    if (!open || !loadPage) return;
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setPage(1);
      void doLoadPage(1, searchText, true);
    }, 300);
    return () => {
      if (searchRef.current) clearTimeout(searchRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // load more
  const loadMore = () => {
    if (!loadPage) return;
    if (loadingMore || loading) return;
    if (!hasMore) return;
    const next = page + 1;
    setPage(next);
    void doLoadPage(next, searchText, false);
  };

  // filtered view (client side when data prop used or server already filtered)
  const filtered = useMemo(() => {
    if (!searchText) return items;
    const s = searchText.toLowerCase();
    return items.filter(
      (it) =>
        String(it[nameKey] ?? "")
          .toLowerCase()
          .includes(s) ||
        String(it.contact_number ?? "")
          .toLowerCase()
          .includes(s)
    );
  }, [items, searchText, nameKey]);

  const selectedLabel = useMemo(() => {
    if (!value) return placeholder ?? `Select ${label}...`;
    const found = items.find((it) => String(it[idKey]) === String(value));
    return found ? String(found[nameKey] ?? String(value)) : String(value);
  }, [value, items, idKey, nameKey, label, placeholder]);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.selector} onPress={() => setOpen(true)}>
        <Text style={styles.selectorText}>{selectedLabel}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <TextInput
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.searchInput}
                  autoFocus
                />

                {loading ? (
                  <View style={{ padding: 20 }}>
                    <ActivityIndicator />
                  </View>
                ) : (
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={filtered}
                    keyExtractor={(item, index) =>
                      String(item[idKey] ?? item.name ?? index)
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                          onSelect(item[idKey] ?? item.name);
                          setOpen(false);
                          setSearchText("");
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text>{item[nameKey]}</Text>
                          <Text>{item.contact_number ?? ""}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                      if (loadPage) loadMore();
                    }}
                    ListFooterComponent={
                      loadingMore ? (
                        <ActivityIndicator style={{ margin: 12 }} />
                      ) : null
                    }
                    style={{ maxHeight: 360 }}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  selector: {
    borderWidth: 1,
    borderColor: "#6b21a8",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  selectorText: { fontWeight: "700", color: "#6b21a8" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 420,
    overflow: "hidden",
  },
  searchInput: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  item: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
});
