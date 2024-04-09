import React from "react";
import FormInfo from "../FormInfo/FormInfo";

const Sidebar: React.FC = () => {
  return (
    <div className="basis-1/5 w-64 rounded-2xl bg-indigo-100 pl-6 pr-2 py-8 ">
      {" "}
      <FormInfo />
    </div>
  );
};

export default Sidebar;
