import { MainLayout } from "@/components/layout/MainLayout";
import { ProductForm } from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4  bg-blue-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product in your inventory.
          </p>
        </div>
        
        <div className="rounded-lg border p-6 mt-4 bg-white ma">
          <ProductForm />
        </div>
      </div>
    </MainLayout>
  );
} 