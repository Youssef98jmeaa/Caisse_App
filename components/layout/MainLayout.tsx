import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-blue-300 ">
      <Header />
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  );
} 