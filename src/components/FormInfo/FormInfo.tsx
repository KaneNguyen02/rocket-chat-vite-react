import React, { ChangeEvent, useState } from "react";
import { useEffect } from "react";

const FormInfo: React.FC = () => {
  const [username, setUsername] = useState<string>("");

  const [currentUser, setCurrentUser] = useState<string>(
    localStorage.getItem("username") || ""
  );

  const handleSetUsername = () => {
    localStorage.setItem("username", username);
    setUsername("");
    setCurrentUser(username);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    localStorage.getItem("username");
  }, [username]);

  return (
    <div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <div className="flex">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username || ""}
            onChange={handleInputChange}
          />
          <button
            onClick={handleSetUsername}
            className="ml-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
          >
            Enter
          </button>
        </div>
      </div>

      <div className="ml-2 text-sm font-semibold">
        {currentUser === ""
          ? "Not have Username"
          : `Current Username is: ${currentUser}`}
      </div>
    </div>
  );
};

export default FormInfo;
