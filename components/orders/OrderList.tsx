import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Order } from "@/types";
import { OrderActions } from "./OrderActions";

async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/orders`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error loading orders:", error);
    return [];
  }
}

export async function OrderList() {
  const orders = await getOrders();

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-background">
        <h3 className="text-lg font-medium mb-3">No orders yet</h3>
        <p className="text-muted-foreground mb-6">
          Orders will appear here when customers make purchases.
        </p>
        <Button asChild>
          <Link href="/">Go to POS</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{order.items.length} items</TableCell>
              <TableCell className="text-right">{formatCurrency(order.totalAmount.toString())}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "COMPLETED"
                      ? "default"
                      : order.status === "CANCELLED"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <OrderActions order={order} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 