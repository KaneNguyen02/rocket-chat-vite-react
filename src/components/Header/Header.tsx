import { ChangeEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { sdk } from '../../services/SDK'
import { API_HOST_URL } from '../../api/axiosInstance'

const Header = () => {
  
  const username = sdk.currentUser?.username
  const currentAvatar = `${API_HOST_URL}/avatar/${username}`

  const [isHovered, setIsHovered] = useState(false)
  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <>
      <div className='flex justify-between items-center h-14 w-full bg-gray-300 mb-6 '>
        <div className='flex ml-6 my-2'>
          <Link to='/'>
            <img src='/logo.svg' alt='logo' />
          </Link>
        </div>

        <div className='mr-6' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className='relative'>
            <img
              src={currentAvatar}
              alt='Avatar'
              className='h-10 w-10 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500'
            />

            {isHovered && (
              <div
                className='absolute top-5 right-0  my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-md shadow dark:bg-gray-700 dark:divide-gray-600'
                id='dropdown-2'
              >
                <div className='px-4 py-3' role='none'>
                  <p className='text-sm text-gray-900 dark:text-white' role='none'>
                    Neil Sims
                  </p>
                  <p className=' text-sm font-medium text-gray-900 truncate dark:text-gray-300' role='none'>
                    neil.sims@flowbite.com
                  </p>
                </div>
                <ul className='py-1' role='none'>
                  <li>
                    <Link
                      to='/settings'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                      role='menuitem'
                    >
                      Settings
                    </Link>
                  </li>

                  <li>
                    <a
                      href='#'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                      role='menuitem'
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
