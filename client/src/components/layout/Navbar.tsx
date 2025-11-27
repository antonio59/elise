import { Link, useLocation } from "wouter";
import { BookOpen, Palette, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Bookshelf", icon: BookOpen },
    { href: "/art", label: "My Art", icon: Palette },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-purple-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <span className="font-display text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer">
            Niece's World
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer",
                    isActive
                      ? "bg-primary text-white shadow-md scale-105"
                      : "text-muted-foreground hover:bg-purple-50 hover:text-primary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
