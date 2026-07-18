/** Date picker that opens on press and returns ISO 8601 string. */
import React, { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Colors, Spacing, Typography } from "@/src/core/theme";

interface Props {
  label?: string;
  value: string; // ISO 8601 (e.g. "2002-02-20T00:00:00.000Z")
  onChange: (iso: string) => void;
  error?: string;
  maximumDate?: Date;
}

export const DatePicker = ({
  label,
  value,
  onChange,
  error,
  maximumDate,
}: Props) => {
  const [show, setShow] = useState(false);
  const date = value ? new Date(value) : new Date();

  const handleChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      setShow(false);
      if (selectedDate) onChange(selectedDate.toISOString());
    },
    [onChange],
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={[styles.trigger, error && styles.triggerError]}
        onPress={() => setShow(true)}
      >
        <Text style={[styles.valueText, !value && styles.placeholder]}>
          {value
            ? `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`
            : "DD-MM-AAAA"}
        </Text>
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate ?? new Date()}
          accentColor={Colors.primary}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 5 },
  label: {
    fontSize: Typography.sizes.md,
    marginBottom: 2,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  trigger: {
    height: 40,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  triggerError: { borderBottomColor: "#e74c3c" },
  valueText: { fontSize: Typography.sizes.lg, color: Colors.text.primary },
  placeholder: { color: "gray" },
  errorText: { color: "#e74c3c", fontSize: 12, marginTop: Spacing.xs },
});
