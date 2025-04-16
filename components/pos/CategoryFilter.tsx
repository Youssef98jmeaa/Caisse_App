"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <Tabs
        value={selectedCategoryId || "all"}
        onValueChange={(value) => onSelectCategory(value === "all" ? null : value)}
        className="w-full"
      >
        <TabsList className="w-full justify-start h-auto p-1">
          <TabsTrigger value="all" className="px-4 py-2">
            All Products
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="px-4 py-2"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
} 