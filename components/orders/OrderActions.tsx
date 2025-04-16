"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatus, Order } from "@/types";

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter();
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (status === order.status) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success("Order status updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
      setStatus(order.status); // Reset to original status
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDetailsDialog(true)}
        >
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{order.id.substring(0, 8)} - {formatDate(order.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status Update */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Status</span>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as OrderStatus)}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                onClick={handleStatusUpdate}
                disabled={status === order.status || isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-medium mb-2">Items</h3>
              <div className="border rounded-md">
                <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50 text-sm font-medium">
                  <div>Product</div>
                  <div className="text-right">Price</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Subtotal</div>
                </div>

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-4 gap-4 p-3 border-b last:border-0 text-sm"
                  >
                    <div>{item.product.name}</div>
                    <div className="text-right">
                      {formatCurrency(item.priceAtPurchase.toString())}
                    </div>
                    <div className="text-center">{item.quantity}</div>
                    <div className="text-right font-medium">
                      {formatCurrency(
                        parseFloat(item.priceAtPurchase.toString()) *
                          item.quantity
                      )}
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-4 gap-4 p-3 bg-muted/30">
                  <div className="col-span-3 text-right font-medium">Total</div>
                  <div className="text-right font-bold">
                    {formatCurrency(order.totalAmount.toString())}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 