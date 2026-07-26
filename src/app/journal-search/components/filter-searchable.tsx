"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

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

  const getNameById = (id: string) =>
    options.find((o) => o.id.toString() === id)?.name ?? "";

  const displayValue = isEditing ? inputValue : getNameById(value);
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(displayValue.toLowerCase())
  );

  const handleInputValueChange = (newValue: string) => {
    setIsEditing(true);
    setInputValue(newValue);
  };

  const handleValueChange = (newValue: string | null) => {
    const id = newValue ?? "";
    onChange(id);
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
              <ComboboxItem key={option.id} value={option.id.toString()}>
                {option.name}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
