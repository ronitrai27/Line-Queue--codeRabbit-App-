"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard" },
  { title: "Repository", url: "/repository" },
  { title: "Reviews", url: "/reviews" },
  { title: "Subscriptions", url: "/subscriptions" },
  { title: "Settings", url: "/settings" },
];

export function DashboardBreadcrumbs() {
  const pathname = usePathname();

  const activeItem = navigationItems.find(
    (item) => pathname === item.url || pathname.startsWith(item.url + "/")
  );

  if (!activeItem) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{activeItem.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
