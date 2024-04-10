import React, { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import StorageService from '../utils/storage'
import { sdk } from '../services/SDK'

type PrivateRouteProps = {
  children: ReactNode
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false)
  const token = StorageService.get('token')

  useEffect(() => {
    console.log('connected to socket login')

    if (!sdk.current) {
      sdk.connect()
      // subscribe room - message event
    }
  }, [sdk.current, token, setIsLogin])

  useEffect(() => {
    if (token && sdk.current) {
      sdk.login({ resume: token }).then((data) => {
        console.log('resume', data)
        setIsLogin(true)
      })
    }
  }, [token, sdk.current, setIsLogin])

  const location = useLocation()

  console.log("isLogin", isLogin);
  
  if (!isLogin) {
    return <Navigate to='/sign-in' state={{ from: location.pathname }} replace /> // change 
  }
  return children
}
