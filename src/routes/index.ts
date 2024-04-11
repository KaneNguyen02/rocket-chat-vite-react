import { DefaultLayout } from '../Layout/Layout'
import { lazy } from 'react'
import Login from '../pages/Login/Login'
import HomePage from '../pages/Home/HomePage'
import SettingPage from '../Layout/Setting/Setting'

// const HomePage = lazy(() => import("../pages/Home/HomePage"));

export const privateRoutes = [
  { path: '/', component: HomePage, layout: DefaultLayout },
  { path: '/settings', component: SettingPage, layout: DefaultLayout }
]
export const publicRoutes = [{ path: '/sign-in', component: Login, layout: null }]
