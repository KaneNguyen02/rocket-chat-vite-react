import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StorageService from '../../utils/storage'
import { sdk } from '../../services/SDK'


const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const isFormValid = username.trim() !== '' && password.trim() !== ''
  const navigate = useNavigate()

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const fetchData = async () => {
      setError('')

      try {
        const res: any = await sdk.login({ username, password })
        StorageService.set('token', res.token)
        StorageService.set('id', res.id)
        navigate('/')
      } catch (error) {
        setError('Username or password invalid')
      }
    }
    fetchData()
  }



  return (
    <div className="flex min-h-full h-screen justify-center bg-[url('/login-bg.png')]">
      <div className='flex justify-center items-center '>
        <form onSubmit={handleSubmit}>
          <div className='w-[400px] min-h-[350px] bg-opacity-10 bg-white backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-white '>
            <div className='flex flex-col  gap-5'>
              <div className='text-2xl font-bold text-center'>SIGN IN</div>
              <div className=''>
                <label className='block text-sm font-medium leading-6 text-gray-900' htmlFor='username'>
                  Username
                </label>
                <input
                  id='username'
                  type='text'
                  value={username}
                  onChange={handleChangeUsername}
                  placeholder='Enter username'
                  className='px-4 py-3 w-full rounded-xl focus-visible:outline-indigo-600 bg-opacity-30 bg-white border border-white'
                />
              </div>

              <div className=''>
                <label className='block text-sm font-medium leading-6 text-gray-900' htmlFor='password'>
                  Password
                </label>
                <input
                  id='password'
                  type='password'
                  placeholder='Enter username'
                  value={password}
                  onChange={handleChangePassword}
                  className='px-4 py-3 w-full rounded-xl focus-visible:outline-indigo-600 bg-opacity-30 bg-white border border-white'
                  current-password='current-password'
                />
                <p className='leading-8 '>
                  I don't have account
                  <span className='text-blue-600 font-bold inline ml-2'>Register</span>
                </p>
                {error && <div style={{ color: 'red' }}>{error}</div>}
              </div>
              <div className=''>
                <button
                  type='submit'
                  disabled={!isFormValid}
                  className='text-white bg-blue-600 disabled:bg-gray-500 disabled:opacity-20 w-full rounded-xl p-3 mt-2'
                >
                  Sign-in
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
