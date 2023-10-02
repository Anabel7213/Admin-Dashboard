"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"
   
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export function MobileNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Dashboard',
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Products',
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Orders',
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/customers`,
      label: 'Customers',
      active: pathname === `/${params.storeId}/customers`,
    },
    {
      href: `/${params.storeId}/inquiries`,
      label: 'Inquiries',
      active: pathname === `/${params.storeId}/inquiries`,
    },
    {
      href: `/${params.storeId}/reviews`,
      label: 'Reviews',
      active: pathname === `/${params.storeId}/reviews`,
    },
    {
      href: `/${params.storeId}/blog`,
      label: 'Blog',
      active: pathname === `/${params.storeId}/post`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
     <DropdownMenu>
  <DropdownMenuTrigger className="flex items-end"><Button variant="outline">Menu</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    {routes.map((route) => (
    <DropdownMenuItem className="flex p-2" key={route.href}>
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      </DropdownMenuItem>
      ))}
  </DropdownMenuContent>
</DropdownMenu>
    </nav>
  )
};