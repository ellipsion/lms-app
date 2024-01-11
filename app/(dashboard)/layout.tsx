import { TLayoutProps } from "@/lib/typings";
import React from "react";
import Sidebar from "./_components/sidebar";

const DashboardLayout = ({ children }: TLayoutProps) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full bg-gray-50 w-56 flex-col z-50">
        <Sidebar />
      </div>
      {children}
    </div>
  );
};

export default DashboardLayout;
