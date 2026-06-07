/** Date picker component with DD-MM-YYYY format. */
import React, { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Colors, Spacing, Typography } from "@/src/core/theme";

interface Props {
  label?: string;
  value: string; // DD-MM-YYYY
  onChange: (date: string) => void;
  error?: string;
  maximumDate?: Date;
}

function parseDate(str: string): Date {
  const parts = str.split("-");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map(Number);
    if (dd && mm && yyyy) return new Date(yyyy, mm - 1, dd);
  }
  return new Date();
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/** Date picker that opens on press and returns DD-MM-YYYY string. */
export const DatePicker = ({
  label,
  value,
  onChange,
  error,
  maximumDate,
}: Props) => {
  const [show, setShow] = useState(false);
  const date = parseDate(value);

  const handleChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) onChange(formatDate(selectedDate));
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
          {value || "DD-MM-AAAA"}
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
