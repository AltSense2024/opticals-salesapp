import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface DataDropDownProps {
  data: any[];
  label: string;
  value: string | null | number;
  onSelect: (value: string) => void;
}

const DataDropDown: React.FC<DataDropDownProps> = ({
  data,
  label,
  value,
  onSelect,
}) => {
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  // console.log("data in dropdown", data);
  // filter data based on search
  const filteredData = data?.filter((item) =>
    item?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (item: string) => {
    console.log("item", item);
    onSelect(item); // ✅ push value to Formik
    setOpenDropDown(false);
    setSearchText("");
  };

  console.log("value", value);

  // const selectedItem = data.find((item)=>item.id == )

  return (
    <View>
      <Text className="text-lg font-semibold mb-2">{label}</Text>
      <TouchableOpacity
        className="border border-primary rounded-2xl p-3"
        onPress={() => setOpen(!open)}
      >
        <Text className="font-bold text-primary">
          {/* {value ? value : `Select an ${label}...`} */}
          {value
            ? (data.find((item) => item.id === value)?.name ?? value)
            : `Select an ${label}...`}
        </Text>
      </TouchableOpacity>

      {/* {openDropDown && (
        <View style={styles.dropdown}>
          <TextInput
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            className="text-primary p-3"
          />

          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item.id ? item.id : item.name)}
              >
                <Text>{item?.name ?? " "}</Text>
                <Text>{item?.qty ?? " "}</Text>
                <Text>{item?.contact_number ?? " "}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )} */}
      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  maxHeight: 300,
                }}
              >
                <TextInput
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={setSearchText}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderColor: "#ddd",
                  }}
                />

                <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                  {filteredData.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderColor: "#eee",
                      }}
                      onPress={() => {
                        onSelect(item.id);
                        setOpen(false); // close modal
                        setSearchText("");
                      }}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </KeyboardAwareScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default DataDropDown;

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    maxHeight: 200,
    backgroundColor: "#fff",
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
