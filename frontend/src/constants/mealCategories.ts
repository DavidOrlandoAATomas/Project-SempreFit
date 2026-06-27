import {
  MealCategory
} from "@/types/meal";

export const mealCategories: {
  value: MealCategory;
  label: string;
}[] = [

  {
    value: "BREAKFAST",
    label: "Pequeno-almoço"
  },

  {
    value: "LUNCH",
    label: "Almoço"
  },

  {
    value: "DINNER",
    label: "Jantar"
  },

  {
    value: "SNACK",
    label: "Lanche"
  },

  {
    value: "DESSERT",
    label: "Sobremesa"
  },

  {
    value: "BEVERAGE",
    label: "Bebida"
  }
];