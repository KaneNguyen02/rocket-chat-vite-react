import React, { ChangeEvent, useEffect, useReducer, useState } from 'react'
import { sdk } from '../../services/SDK'
import api, { API_HOST_URL } from '../../api/axiosInstance'
import { IUserInfo } from '../../utils/constant'
import { ToastContainer, toast } from 'react-toastify'
const statusOptions = ['online', 'away', 'busy', 'offline']

const SettingPage: React.FC = () => {
  let username = sdk.currentUser?.username
  const [currentAvatar, setCurrentAvatar] = useState<string>(`${API_HOST_URL}/avatar/${username}?${new Date().getTime()}`)
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const getUsername = async () => {
      username = await sdk.currentUser?.username
    }
    getUsername().then(() => console.log(1111111))
  }, [sdk.currentUser])

  const [info, setInfo] = useState({
    name: '',
    username: '',
    statusType: '',
    bio: '',
    statusText: 'On a vacation'
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setInfo((prevState) => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // console.log("🚀 ~ handleImageChange ~ file:", file)
      setImage(file)

      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateAvatar = () => {
    if (!image) return
    console.log(image)
    const formData = new FormData()

    formData.append('image', image)

    api
      .post('/api/v1/users.setAvatar', formData)
      .then((response) => {
        console.log('Avatar updated successfully:', response.data)
        if (response.status === 200) {
          toast.success('Update avatar success!')
          setCurrentAvatar(`${API_HOST_URL}/avatar/${username}?${new Date().getTime()}`)
        } else {
          toast.error('Update failed')
        }
      })
      .catch((error) => {
        console.error('Error updating avatar:', error)
      })
  }

  useEffect(() => {
    const getInfo = async () => {
      const res = await api.get(`/api/v1/users.info?username=${username}`)
      console.log('🚀 ~ useEffect ~ res:', res)
      const user = res.data.user
      setInfo({
        name: user?.name,
        username: user?.username,
        statusType: user?.status,
        bio: user?.bio,
        statusText: 'On a vacation'
      })
      console.log(info)
    }
    getInfo()
  }, [sdk.currentUser])

  const handleUpdateProfile = async () => {
    const updateOwnBasicInfo = async () => {
      const res = await api.post(`/api/v1/users.updateOwnBasicInfo`, {
        data: info
      })

      if (res.status === 200) {
        toast.success('Update info success!')
      } else {
        toast.error('Update failed')
      }
    }
    await updateOwnBasicInfo()
  }

  return (
    <div>
      <h2 className='font-bold text-xl'>User settings</h2>
      <main className='w-full py-1 md:w-2/3 lg:w-3/4'>
        <div className='p-2 md:p-4'>
          <div className='w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg'>
            <div className='grid max-w-2xl mx-auto mt-8'>
              <div className='flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0'>
                <img
                  className='object-none w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500'
                  src={image ? (typeof previewUrl === 'string' ? previewUrl : '') : currentAvatar}
                  alt='Bordered avatar'
                />

                <div className='flex flex-col space-y-5 sm:ml-8'>
                  <label
                    htmlFor='uploadInput'
                    className='block py-3.5 px-8 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 cursor-pointer'
                  >
                    Chose avatar
                    <input
                      id='uploadInput'
                      type='file'
                      onChange={handleImageChange}
                      accept='image/*'
                      className='hidden'
                    />
                  </label>
                  <button
                    onClick={handleUpdateAvatar}
                    type='button'
                    className='py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 '
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className='items-center mt-8 sm:mt-14 text-[#202142]'>
                <div className='flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6'>
                  <div className='w-full'>
                    <label htmlFor='name' className='block mb-2 text-sm font-medium text-indigo-900'>
                      Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                      placeholder='Your first name'
                      value={info?.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='w-full'>
                    <label htmlFor='username' className='block mb-2 text-sm font-medium text-indigo-900'>
                      Username
                    </label>
                    <input
                      type='text'
                      id='username'
                      className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                      placeholder='Username'
                      value={info?.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* <div className='mb-2 sm:mb-6'>
                  <label htmlFor='email' className='block mb-2 text-sm font-medium text-indigo-900'>
                    Your email
                  </label>
                  <input
                    type='email'
                    id='email'
                    className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                    placeholder='Email address'
                    value={info?.email}
                    onChange={handleChange}
                    required
                  />
                </div> */}

                <div className='mb-2 sm:mb-6'>
                  <label htmlFor='statusType' className='block mb-2 text-sm font-medium text-indigo-900'>
                    Status
                  </label>

                  <select
                    id='statusType'
                    className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                    value={info.statusType}
                    onChange={handleChange}
                    required
                  >
                    <option value={info.statusType}>{info.statusType}</option> {/* Option mặc định */}
                    {statusOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='mb-6'>
                  <label htmlFor='bio' className='block mb-2 text-sm font-medium text-indigo-900'>
                    Bio
                  </label>
                  <textarea
                    id='bio'
                    rows={4}
                    className='block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 '
                    placeholder='Write your bio here...'
                    value={info?.bio}
                    onChange={(e) => handleChange(e)}
                  ></textarea>
                </div>

                <div className='flex justify-end'>
                  <button
                    onClick={() => handleUpdateProfile()}
                    type='submit'
                    className='text-white bg-blue-600  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800'
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingPage
