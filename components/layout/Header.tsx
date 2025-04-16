import Link from "next/link";
import { MainNav } from "./MainNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block text-xl">CaisseApp</span>
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          {/* We can add user profile or theme toggle button here in the future */}
        </div>
      </div>
    </header>
  );
} 