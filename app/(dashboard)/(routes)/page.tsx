import React from "react";
import { UserButton } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex justify-between p-5">
      <h1 className="text-2xl font-bold">Lorem.</h1>
      <h2 className="text-xl font-medium">Dashboard</h2>
      <UserButton />
    </div>
  );
};

export default page;
