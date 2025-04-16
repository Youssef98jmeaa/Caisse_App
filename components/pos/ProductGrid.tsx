"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  selectedCategoryId?: string | null;
}

export function ProductGrid({ 
  products, 
  onSelectProduct,
  selectedCategoryId
}: ProductGridProps) {
  const filteredProducts = selectedCategoryId 
    ? products.filter(product => product.categoryId === selectedCategoryId)
    : products;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
      {filteredProducts.map((product) => (
        <Card 
          key={product.id} 
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => onSelectProduct(product)}
        >
          <CardContent className="p-4 flex flex-col items-center justify-between h-full">
            <div className="relative w-full h-32 mb-2 bg-muted rounded-md overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <div className="w-full text-center">
              <h3 className="font-medium truncate">{product.name}</h3>
              <p className="text-green-600 font-semibold">{formatCurrency(product.price.toString())}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {product.stock > 0 ? `Stock: ${product.stock}` : "Out of stock"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          No products found. {selectedCategoryId ? "Try selecting a different category." : ""}
        </div>
      )}
    </div>
  );
} 