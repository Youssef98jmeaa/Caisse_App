import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import { ProductActions } from "./ProductActions";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/products`);

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export async function ProductTable() {
  const products = await getProducts();

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-background">
        <h3 className="text-lg font-medium mb-3">No products yet</h3>
        <p className="text-muted-foreground mb-6">
          Add a product to start managing your inventory.
        </p>
        <Button asChild>
          <Link href="/products/new">Add Your First Product</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white   ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category?.name || "—"}</TableCell>
              <TableCell className="text-right">{formatCurrency(product.price.toString())}</TableCell>
              <TableCell className="text-center">
                <span
                  className={
                    product.stock <= 0
                      ? "text-red-500"
                      : product.stock < 5
                      ? "text-yellow-500"
                      : "text-green-500"
                  }
                >
                  {product.stock}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {format(new Date(product.updatedAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <ProductActions product={product} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 