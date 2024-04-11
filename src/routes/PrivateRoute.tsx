import React, { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import StorageService from '../utils/storage'
import { sdk } from '../services/SDK'

type PrivateRouteProps = {
  children: ReactNode
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const token = StorageService.get('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (sdk.currentUser?._id) {
      setIsLogin(true)
      setIsLoading(false)
      return
    }

    if (token) {
      setIsLoading(true)
      sdk.current && sdk
        .login({ resume: token })
        .then((data) => {
          console.log('resume', data)
          setIsLogin(true)
          setIsLoading(false)
        })
        .catch((err: any) => {
          setIsLoading(false)
          console.log('err isLogin', isLogin)
          navigate('/sign-in')
        })
    } else {
      setIsLoading(false)
      navigate('/sign-in')
    }
  }, [token, sdk.current, sdk.currentUser, setIsLogin])

  if (isLoading) return <div>Loading...</div>

  if (!isLogin) {
    // return navigate('/sign-in')
    return <div>Loading...</div>

  }
  return children
}
