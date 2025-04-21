import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { OrderList } from '@/components/orders/OrderList';
import { OrderListSkeleton } from '@/components/orders/OrderListSkeleton';

export const dynamic = 'force-dynamic';

export default function OrdersPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            View and manage all your orders.
          </p>
        </div>
        <div className="flex flex-col py-3 border rounded-lg bg-background" >
          <Suspense fallback={<OrderListSkeleton />}>
            <OrderList />
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
} 