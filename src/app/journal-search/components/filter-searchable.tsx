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
  const [inputValue, setInputValue] = useState(value);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Combobox
        value={value}
        onValueChange={(v) => onChange(v ?? "")}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
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
  const [inputValue, setInputValue] = useState(
    options.find((o) => o.id.toString() === value)?.name ?? ""
  );

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Combobox
        value={value}
        onValueChange={(v) => onChange(v ?? "")}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
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
