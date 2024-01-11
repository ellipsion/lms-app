"use client";

import { Compass, Layout } from "lucide-react";
import SidebarItem from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const SidebarRoutes = () => {
  const routes = guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem key={route.href} {...route} />
      ))}
    </div>
  );
};

export default SidebarRoutes;
