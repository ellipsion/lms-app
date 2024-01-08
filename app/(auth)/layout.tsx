import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
