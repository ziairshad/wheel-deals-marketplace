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
  children?: React.ReactNode;
  isNested?: boolean;
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
  children,
  isNested = false,
}) => {
  // When isNested is true, we don't want to wrap in an AccordionItem or show a label
  if (isNested) {
    return (
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
    );
  }

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
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};
