import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductForm } from "@/components/products/ProductForm";
import { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch product");
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error loading product:", error);
    return null;
  }
}

export default async function EditProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight ">Edit Product</h1>
          <p className="text-black">
            Update the information for {product.name}.
          </p>
        </div>
        
        <div className="rounded-lg border p-6 mt-4 bg-white">
          <ProductForm initialData={product} />
        </div>
      </div>
    </MainLayout>
  );
} 