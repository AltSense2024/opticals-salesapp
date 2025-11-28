import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface DateInputProps {
  label: string;
  value?: Date;
  onChange: (date: Date) => void;
  error?: string;
  placeholder?: string;
  editable?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = "Select date",
  editable = true,
}) => {
  const [show, setShow] = useState(false);
  const parsedValue = value ? new Date(value) : new Date();
  const [internalDate, setInternalDate] = useState<Date>(parsedValue);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setInternalDate(selectedDate);
      onChange(selectedDate);
    }
  };

  console.log("value in datetime", value, parsedValue);
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        onPress={() => editable && setShow(true)}
        style={[styles.inputBox, !editable && { backgroundColor: "#f0f0f0" }]}
      >
        <Text style={{ color: internalDate ? "black" : "grey" }}>
          {parsedValue.toDateString() ?? "Select Date"}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={parsedValue}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default DateInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
    fontSize: 16,
  },
  inputBox: {
    borderWidth: 2,
    borderColor: "#491B6D", // primary color
    padding: 12,
    borderRadius: 12,
  },
  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});
