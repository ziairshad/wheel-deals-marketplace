
import React from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectFilterProps {
  title: string;
  placeholder: string;
  value: string | null;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  accordionValue: string;
}

export const CustomSelectFilter: React.FC<CustomSelectFilterProps> = ({
  title,
  placeholder,
  value,
  options,
  onValueChange,
  accordionValue,
}) => {
  return (
    <AccordionItem value={accordionValue}>
      <AccordionTrigger className="py-3">{title}</AccordionTrigger>
      <AccordionContent>
        <Select onValueChange={onValueChange} value={value || ""}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AccordionContent>
    </AccordionItem>
  );
};
