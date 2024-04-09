import React from "react";

const Login: React.FC = () => {
  return (
    <div className="flex min-h-full h-screen justify-center ">
      <div className="flex justify-center items-center ">
        <div className="w-[400px] min-h-[350px] bg-slate-400 p-6 rounded-xl">
          <div className="flex flex-col  gap-5">
            <div className="text-2xl font-bold text-center">SIGN IN</div>
            <div className="">
              <label
                className="block text-sm font-medium leading-6 text-gray-900"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                className="px-4 py-3 w-full rounded-xl focus-visible:outline-indigo-600 "
              />
            </div>

            <div className="">
              <label
                className="block text-sm font-medium leading-6 text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter username"
                className="px-4 py-3 w-full rounded-xl focus-visible:outline-indigo-600 "
              />
              <p className="leading-8 ">
                I don't have account
                <p className="text-blue-600 font-bold inline ml-2">Register</p>
              </p>
            </div>
            <div className="">
              <button className="text-white bg-blue-600 w-full rounded-xl p-3 mt-2">
                Sign-in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
