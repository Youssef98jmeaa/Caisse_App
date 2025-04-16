import { MainLayout } from "@/components/layout/MainLayout";
import { POSInterface } from "@/components/pos/POSInterface";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
        <p className="text-muted-foreground">
          Create new orders by selecting products and completing the checkout process.
        </p>
        <POSInterface />
      </div>
    </MainLayout>
  );
}
