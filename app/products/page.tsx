import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductTableSkeleton } from '@/components/products/ProductTableSkeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory.
            </p>
          </div>
          <Button asChild>
            <Link href="/products/new">Add Product</Link>
          </Button>
        </div>
        
        <Suspense fallback={<ProductTableSkeleton />}>
          <ProductTable />
        </Suspense>
      </div>
    </MainLayout>
  );
} 