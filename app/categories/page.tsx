import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryListSkeleton } from '@/components/categories/CategoryListSkeleton';
import { CategoryForm } from '@/components/categories/CategoryForm';

export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground ">
            Manage product categories to organize your inventory.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 ">Add New Category</h2>
            <div className="rounded-lg border p-4 bg-white">
              <CategoryForm />
            </div>
          </div>
          <div className="md:col-span-3 ">
            <h2 className="text-xl font-semibold mb-4 ">Existing Categories</h2>
            <Suspense fallback={<CategoryListSkeleton />}>
              <CategoryList />
            </Suspense>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 