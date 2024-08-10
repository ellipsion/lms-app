import { getAnalytics } from "@/actions/get-analytics";
import DataCard from "@/components/custom/data-card";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import { SalesChart } from "./_components/bar-chart";

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <DataCard label="Total Revenue" value={totalRevenue} format />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="mt-5 col-span-2">
          <SalesChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
