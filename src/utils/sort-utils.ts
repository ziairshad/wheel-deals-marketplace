import { SortOption } from "./filter-utils";

export type DatabaseSortOption = {
  id: string;
  label: string;
  column: string;
  ascending: boolean;
};

// Map our sort options to database sort options
export const sortOptionsToDatabase = (option: SortOption): DatabaseSortOption => {
  switch (option.id) {
    case "latest":
      return {
        id: option.id,
        label: option.label,
        column: "created_at",
        ascending: false
      };
    case "price-low-high":
      return {
        id: option.id,
        label: option.label,
        column: "price",
        ascending: true
      };
    case "price-high-low":
      return {
        id: option.id,
        label: option.label,
        column: "price",
        ascending: false
      };
    case "year-new-old":
      return {
        id: option.id,
        label: option.label,
        column: "year",
        ascending: false
      };
    case "year-old-new":
      return {
        id: option.id,
        label: option.label,
        column: "year",
        ascending: true
      };
    case "mileage-low-high":
      return {
        id: option.id,
        label: option.label,
        column: "mileage",
        ascending: true
      };
    default:
      return {
        id: option.id,
        label: option.label,
        column: "created_at",
        ascending: false
      };
  }
}; 