"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProductGrid } from "./ProductGrid";
import { CartSection, CartItem } from "./CartSection";
import { CategoryFilter } from "./CategoryFilter";
import { Product, Category } from "@/types";

export function POSInterface() {
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories")
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData.data || []);
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load products and categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add product to cart
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Check if we can add more of this product
        if (existingItem.quantity >= product.stock) {
          toast.error("Cannot exceed available stock");
          return prevItems;
        }

        // Update existing item quantity
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    toast.success(`Added ${product.name} to cart`);
  };

  // Update cart item quantity
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  // Process checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsProcessingCheckout(true);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      // Get response but not using it directly since we're just clearing the cart
      await response.json();
      
      // Clear cart after successful order
      setCartItems([]);
      
      // Update product stocks
      setProducts(prevProducts => 
        prevProducts.map(product => {
          const orderedItem = cartItems.find(item => item.id === product.id);
          if (orderedItem) {
            return {
              ...product,
              stock: product.stock - orderedItem.quantity
            };
          }
          return product;
        })
      );

      toast.success("Order completed successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process checkout");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CategoryFilter 
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <ProductGrid 
          products={products}
          onSelectProduct={handleAddToCart}
          selectedCategoryId={selectedCategoryId}
        />
      </div>
      <div>
        <CartSection 
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
          isProcessing={isProcessingCheckout}
        />
      </div>
    </div>
  );
} 