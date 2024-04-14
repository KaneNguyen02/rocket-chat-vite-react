import React, { ChangeEvent, useState } from 'react'
import { sdk } from '../../services/SDK'
import api, { API_HOST_URL } from '../../api/axiosInstance'

const SettingPage: React.FC = () => {
  const username = sdk.currentUser?.username
  const currentAvatar = `${API_HOST_URL}/avatar/${username}`

  console.log("🚀 ~ currentAvatar:", currentAvatar)
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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

  const updateAvatar = () => {
    if (!image) return
    console.log(image)
    const formData = new FormData()

    formData.append("image", image)

    api
      .post('/api/v1/users.setAvatar', formData)
      .then((response) => {
        console.log('Avatar updated successfully:', response.data)
      })
      .catch((error) => {
        console.error('Error updating avatar:', error)
      })
  }

  return (
    <div>
      <h2 className='font-bold text-xl'>User settings</h2>
      <main className='w-full min-h-screen py-1 md:w-2/3 lg:w-3/4'>
        <div className='p-2 md:p-4'>
          <div className='w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg'>
            <div className='grid max-w-2xl mx-auto mt-8'>
              <div className='flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0'>
                <img
                  className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500'
                  src={image ? (typeof previewUrl === 'string' ? previewUrl : '') : currentAvatar}
                  alt='Bordered avatar'
                />

                <div className='flex flex-col space-y-5 sm:ml-8'>
                  <label
                    htmlFor='uploadInput'
                    className='block py-3.5 px-8 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 cursor-pointer'
                  >
                    Change picture
                    <input
                      id='uploadInput'
                      type='file'
                      onChange={handleImageChange}
                      accept='image/*'
                      className='hidden'
                    />
                  </label>
                  <button
                    type='button'
                    className='py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 '
                  >
                    Delete picture
                  </button>
                </div>
              </div>

              <div className='items-center mt-8 sm:mt-14 text-[#202142]'>
                <div className='flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6'>
                  <div className='w-full'>
                    <label
                      htmlFor='first_name'
                      className='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
                    >
                      Your first name
                    </label>
                    <input
                      type='text'
                      id='first_name'
                      className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                      placeholder='Your first name'
                      value='Jane'
                      required
                    />
                  </div>

                  <div className='w-full'>
                    <label
                      htmlFor='last_name'
                      className='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
                    >
                      Your last name
                    </label>
                    <input
                      type='text'
                      id='last_name'
                      className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                      placeholder='Your last name'
                      value='Ferguson'
                      required
                    />
                  </div>
                </div>

                <div className='mb-2 sm:mb-6'>
                  <label htmlFor='email' className='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'>
                    Your email
                  </label>
                  <input
                    type='email'
                    id='email'
                    className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                    placeholder='your.email@mail.com'
                    required
                  />
                </div>

                <div className='mb-2 sm:mb-6'>
                  <label
                    htmlFor='profession'
                    className='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'
                  >
                    Profession
                  </label>
                  <input
                    type='text'
                    id='profession'
                    className='bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 '
                    placeholder='your profession'
                    required
                  />
                </div>

                <div className='mb-6'>
                  <label htmlFor='message' className='block mb-2 text-sm font-medium text-indigo-900 dark:text-white'>
                    Bio
                  </label>
                  <textarea
                    id='message'
                    rows={4}
                    className='block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 '
                    placeholder='Write your bio here...'
                  ></textarea>
                </div>

                <div className='flex justify-end'>
                  <button
                    onClick={() => updateAvatar()}
                    type='submit'
                    className='text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800'
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
