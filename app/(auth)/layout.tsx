import React from "react";
import { TLayoutProps } from "@/lib/typings";

const AuthLayout = ({ children }: TLayoutProps) => {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
