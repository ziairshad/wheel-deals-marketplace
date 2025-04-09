
import React from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFilterProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onOptionChange: (option: string) => void;
  accordionValue: string;
}

export const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  title,
  options,
  selectedOptions,
  onOptionChange,
  accordionValue,
}) => {
  return (
    <AccordionItem value={accordionValue}>
      <AccordionTrigger className="py-3">{title}</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 gap-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${title.toLowerCase()}-${option}`}
                checked={selectedOptions.includes(option)}
                onCheckedChange={() => onOptionChange(option)}
              />
              <Label
                htmlFor={`${title.toLowerCase()}-${option}`}
                className="text-sm cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
