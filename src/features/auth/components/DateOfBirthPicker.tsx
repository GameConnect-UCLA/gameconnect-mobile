/** Wraps the core DatePicker with auth-specific validation (min age 13). */
import { DatePicker } from "@/src/core/components/DatePicker";

interface Props {
  value: string;
  onChange: (date: string) => void;
  error?: string;
}

export default function DateOfBirthPicker({ value, onChange, error }: Props) {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  return (
    <DatePicker
      label="Fecha de nacimiento"
      value={value}
      onChange={onChange}
      error={error}
      maximumDate={maxDate}
    />
  );
}
