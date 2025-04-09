
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

interface SelectFilterProps {
  title: string;
  placeholder: string;
  value: string | null;
  options: string[];
  onValueChange: (value: string) => void;
  accordionValue: string;
  disabled?: boolean;
  maxHeight?: string;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  title,
  placeholder,
  value,
  options,
  onValueChange,
  accordionValue,
  disabled = false,
  maxHeight = "200px",
}) => {
  return (
    <AccordionItem value={accordionValue}>
      <AccordionTrigger className="py-3">{title}</AccordionTrigger>
      <AccordionContent>
        <Select onValueChange={onValueChange} value={value || ""} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={`max-h-[${maxHeight}]`}>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AccordionContent>
    </AccordionItem>
  );
};
