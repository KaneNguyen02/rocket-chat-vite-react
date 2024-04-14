import React from "react";
import FormInfo from "../FormInfo/FormInfo";
import ListConversation from "../ListConversations/ListConversation";

const Sidebar: React.FC = () => {
  return (
    <div className="basis-1/5 w-64 rounded-2xl pl-6 pr-2 pb-8">
      {" "}
      {/* <FormInfo /> */}
      <ListConversation />
    </div>
  );
};

export default Sidebar;
