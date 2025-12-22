"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard" },
  { title: "Repository", url: "/dashboard/repository" },
  { title: "Reviews", url: "/dashboard/reviews" },
  { title: "Subscriptions", url: "/dashboard/subscriptions" },
  { title: "Settings", url: "/dashboard/settings" },
  { title: "Actions", url: "/dashboard/actions" },
];

export function DashboardBreadcrumbs() {
  const pathname = usePathname();

  // Find the deepest matching route
  const activeItem = navigationItems
    .filter(
      (item) => pathname === item.url || pathname.startsWith(item.url + "/")
    )
    .sort((a, b) => b.url.length - a.url.length)[0];

  if (!activeItem) return null;

  const isDashboardOnly = activeItem.url === "/dashboard";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Dashboard (root) */}
        <BreadcrumbItem>
          {isDashboardOnly ? (
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {/* Child page */}
        {!isDashboardOnly && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{activeItem.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
