import React, { ReactNode } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex flex-row">
        {/* <Sidebar /> */}
        
        <div className="basis-3/4 content flex flex-col flex-auto h-full px-6">
          {children}
        </div>
      </div>
    </>
  );
};
