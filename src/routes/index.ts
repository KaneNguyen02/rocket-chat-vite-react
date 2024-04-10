import { DefaultLayout } from "../Layout/Layout";
import { lazy } from "react";
import Login from "../pages/Login/Login";
import HomePage from "../pages/Home/HomePage";

// const HomePage = lazy(() => import("../pages/Home/HomePage"));

export const privateRoutes = [{ path: "/", component: HomePage, layout: DefaultLayout },
];
export const publicRoutes = [{ path: "/sign-in", component: Login, layout: null }];
