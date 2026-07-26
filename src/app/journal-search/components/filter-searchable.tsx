"use client";

import { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

type IdComboboxOption = { value: string; label: string };

interface FilterSearchableProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FilterSearchable({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
}: FilterSearchableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const displayValue = isEditing ? inputValue : value;
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes((isEditing ? inputValue : value).toLowerCase())
  );

  const handleInputValueChange = (newValue: string) => {
    setIsEditing(true);
    setInputValue(newValue);
  };

  const handleValueChange = (newValue: string | null) => {
    onChange(newValue ?? "");
    setIsEditing(false);
    setInputValue("");
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Combobox
        value={value}
        onValueChange={handleValueChange}
        inputValue={displayValue}
        onInputValueChange={handleInputValueChange}
      >
        <ComboboxInput placeholder={placeholder} showClear />
        <ComboboxContent>
          <ComboboxList>
            {filteredOptions.map((option) => (
              <ComboboxItem key={option} value={option}>
                {option}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

interface FilterSearchableIdProps {
  label: string;
  options: { id: number; name: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FilterSearchableId({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
}: FilterSearchableIdProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const items = useMemo<IdComboboxOption[]>(
    () => options.map((option) => ({ value: option.id.toString(), label: option.name })),
    [options]
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.value === value) ?? null,
    [items, value]
  );

  const filterText = isEditing ? inputValue : (selectedItem?.label ?? "");
  const filteredOptions = items.filter((option) =>
    option.label.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleInputValueChange = (newValue: string) => {
    setIsEditing(true);
    setInputValue(newValue);
  };

  const handleValueChange = (newValue: IdComboboxOption | null) => {
    onChange(newValue?.value ?? "");
    setIsEditing(false);
    setInputValue("");
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Combobox
        value={selectedItem}
        onValueChange={handleValueChange}
        inputValue={filterText}
        onInputValueChange={handleInputValueChange}
        isItemEqualToValue={(item, selected) => item.value === selected.value}
      >
        <ComboboxInput placeholder={placeholder} showClear />
        <ComboboxContent>
          <ComboboxList>
            {filteredOptions.map((option) => (
              <ComboboxItem key={option.value} value={option}>
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
