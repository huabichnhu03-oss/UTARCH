import { Link } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";

export function Navbar() {
  const { data: settings } = useGetSettings();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border w-full">
      <div className="flex h-14 items-center px-4 max-w-screen-2xl mx-auto">
        <Link href="/" className="font-bold tracking-tight text-primary uppercase text-lg shrink-0">
          {settings?.ownerName || "UYEN TON"}
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-accent border-l border-border pl-6 mono">
              Work
            </Link>
            <Link href="/posts" className="text-sm font-medium transition-colors hover:text-accent border-l border-border pl-6 mono">
              Notes
            </Link>
            <Link href="/admin" className="text-sm font-medium transition-colors hover:text-accent border-l border-border pl-6 mono">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
