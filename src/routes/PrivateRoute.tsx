import React, { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import StorageService from '../utils/storage'
import { sdk } from '../services/SDK'

type PrivateRouteProps = {
  children: ReactNode
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const token = StorageService.get('token')
  const navigate = useNavigate()

  useEffect(() => {
    const connectSocket = async () => {
      if (!sdk.current) {
        console.log('connected to socket login')
        await sdk.connect()
        // subscribe room - message event
      }
      connectSocket()
    }
  }, [sdk.current, token, setIsLogin])

  useEffect(() => {
    if (token && sdk.current && !isLoading) {
      setIsLoading(true)
      sdk
        .login({ resume: token })
        .then((data) => {
          console.log('resume', data)
          setIsLogin(true)
          setIsLoading(false)
        })
        .catch((err: any) => {
          console.log('err isLogin', isLogin)
        })
    }
  }, [token, sdk.current, setIsLogin])

  const location = useLocation()

  if (!isLoading && !isLogin) {
    console.log('isLogin >>>>>', isLogin)
    // return navigate('/sign-in')

  }
  return children
}
