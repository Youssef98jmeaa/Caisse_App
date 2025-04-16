"use client";

import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";

export interface CartItem extends Product {
  quantity: number;
}

interface CartSectionProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  isProcessing: boolean;
}

export function CartSection({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isProcessing
}: CartSectionProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price.toString()) * item.quantity,
    0
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Current Order</h3>
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100vh-420px)] overflow-auto">
        {cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between pb-3 border-b">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(item.price.toString())} × {item.quantity}
                  </div>
                </div>
                <div className="flex flex-col items-end ml-4">
                  <div className="font-medium">
                    {formatCurrency(parseFloat(item.price.toString()) * item.quantity)}
                  </div>
                  <div className="flex items-center mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        if (item.quantity < item.stock) {
                          onUpdateQuantity(item.id, item.quantity + 1);
                        } else {
                          toast.error("Cannot exceed available stock");
                        }
                      }}
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-2 text-red-500"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Your cart is empty</p>
            <p className="text-sm">Add products to create an order</p>
          </div>
        )}
      </CardContent>
      {cartItems.length > 0 && (
        <CardFooter className="flex flex-col">
          <Separator className="mb-4" />
          <div className="flex justify-between w-full text-lg font-semibold mb-4">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClearCart}
              disabled={isProcessing}
            >
              Clear Cart
            </Button>
            <Button
              className="flex-1"
              onClick={onCheckout}
              disabled={cartItems.length === 0 || isProcessing}
            >
              {isProcessing ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 