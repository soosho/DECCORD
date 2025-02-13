"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MainNav() {
  const pathname = usePathname();
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated, pathname]);

  const routes = [
    {
      title: "Home",
      url: "/",
      active: pathname === "/",
    },
    {
      title: "Features",
      url: "#",
      items: [
        {
          title: "Authentication",
          description: "Secure login and registration system",
          icon: <Book className="size-5 shrink-0" />,
          url: "/docs/features/auth",
        },
        // Add more features here
      ],
    },
    {
      title: "Documentation",
      url: "/docs",
      active: pathname === "/docs",
    },
    {
      title: "Pricing",
      url: "/pricing",
      active: pathname === "/pricing",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <section className="py-4">
        <div className="container px-6">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:justify-between">
            {/* Left section */}
            <div className="flex-1">
              {/* Empty for spacing */}
            </div>

            {/* Center section with logo and navigation */}
            <div className="flex-[2] flex items-center justify-center gap-24">
              <Link href="/" className="flex items-center">
                <span className="text-lg font-semibold">{siteConfig.name}</span>
              </Link>
              <NavigationMenu>
                <NavigationMenuList className="space-x-1">
                  {routes.map((item) =>
                    item.items ? (
                      <NavigationMenuItem
                        key={item.title}
                        className="text-muted-foreground"
                      >
                        <NavigationMenuTrigger>
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-80 p-3">
                            <NavigationMenuLink>
                              {item.items.map((subItem) => (
                                <li key={subItem.title}>
                                  <Link
                                    href={subItem.url}
                                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                                  >
                                    {subItem.icon}
                                    <div>
                                      <div className="text-sm font-semibold">
                                        {subItem.title}
                                      </div>
                                      {subItem.description && (
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {subItem.description}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </NavigationMenuLink>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    ) : (
                      <Link
                        key={item.title}
                        href={item.url}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                      >
                        {item.title}
                      </Link>
                    )
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right section */}
            <div className="flex-1 flex items-center justify-end gap-2">
              <ModeToggle />
              {isAuthenticated ? (
                <Button asChild size="sm">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-semibold">{siteConfig.name}</span>
              </Link>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {siteConfig.name}
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      {routes.map((item) => (
                        <Link
                          key={item.title}
                          href={item.url}
                          className="text-lg font-semibold"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3">
                      {isAuthenticated ? (
                        <Button asChild>
                          <Link href="/dashboard">Dashboard</Link>
                        </Button>
                      ) : (
                        <>
                          <Button asChild variant="outline">
                            <Link href="/sign-in">Sign In</Link>
                          </Button>
                          <Button asChild>
                            <Link href="/sign-up">Sign Up</Link>
                          </Button>
                        </>
                      )}
                      <ModeToggle />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}