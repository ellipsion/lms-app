import { TLayoutProps } from "@/lib/typings";
import React from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

const DashboardLayout = ({ children }: TLayoutProps) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex flex-col h-full bg-gray-50 w-56 fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 md:pt-[80px] min-h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
