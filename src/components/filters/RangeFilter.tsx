
import React from "react";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface RangeFilterProps {
  title: string;
  min: number;
  max: number;
  value: number[];
  step: number;
  onValueChange: (value: number[]) => void;
  formatValue?: (value: number) => string;
  accordionValue: string;
}

export const RangeFilter: React.FC<RangeFilterProps> = ({
  title,
  min,
  max,
  value,
  step,
  onValueChange,
  formatValue,
  accordionValue,
}) => {
  return (
    <AccordionItem value={accordionValue}>
      <AccordionTrigger className="py-3">{title}</AccordionTrigger>
      <AccordionContent>
        <DualRangeSlider
          min={min}
          max={max}
          step={step}
          defaultValue={[min, max]}
          value={value}
          onValueChange={onValueChange}
          formatValue={formatValue}
          aria-label={`${title.toLowerCase()}-range`}
        />
      </AccordionContent>
    </AccordionItem>
  );
};
