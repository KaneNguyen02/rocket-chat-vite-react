import clsx from 'clsx'
import { IoSearch } from 'react-icons/io5'
import React from 'react'
import { useTheme } from '../../providers/ThemeProvider'
const listRoom = [
  {
    name: 'General',
    imageURL: 'http://localhost:3000/avatar/General',
    lastMessage: 'Hi there!',
    time: '09:30 AM',
    active: true
  },
  {
    name: 'Fullstack',
    imageURL: 'http://localhost:3000/avatar/Fullstack',
    lastMessage: 'New update released!',
    time: '10:15 AM'
  },
  {
    name: 'Technology',
    imageURL: 'http://localhost:3000/avatar/Technology',
    lastMessage: 'Exciting tech news!',
    time: '11:00 AM'
  },
  {
    name: 'Science',
    imageURL: 'http://localhost:3000/avatar/Science',
    lastMessage: 'Recent discoveries!',
    time: '01:45 PM'
  },
  {
    name: 'Business',
    imageURL: 'http://localhost:3000/avatar/Business',
    lastMessage: 'Market trends.',
    time: '03:20 PM'
  },
  { name: 'Art', imageURL: 'http://localhost:3000/avatar/Art', lastMessage: 'Artistic inspiration.', time: '04:55 PM' },
  { name: 'Music', imageURL: 'http://localhost:3000/avatar/Music', lastMessage: 'Favorite song?', time: '08:10 PM' },
  { name: 'Health', imageURL: 'http://localhost:3000/avatar/Health', lastMessage: 'Healthy habits.', time: '10:30 AM' },
  {
    name: 'Education',
    imageURL: 'http://localhost:3000/avatar/Education',
    lastMessage: 'Learning tips.',
    time: '02:15 PM'
  },
  { name: 'Sports', imageURL: 'http://localhost:3000/avatar/Sports', lastMessage: 'Game results.', time: '05:40 PM' },
  { name: 'Food', imageURL: 'http://localhost:3000/avatar/Food', lastMessage: 'New recipe ideas.', time: '07:25 PM' },
  {
    name: 'Travel',
    imageURL: 'http://localhost:3000/avatar/Travel',
    lastMessage: 'Dream destinations.',
    time: '12:20 PM'
  },
  {
    name: 'Fashion',
    imageURL: 'http://localhost:3000/avatar/Fashion',
    lastMessage: 'Latest trends.',
    time: '11:55 AM'
  },
  {
    name: 'Finance',
    imageURL: 'http://localhost:3000/avatar/Finance',
    lastMessage: 'Financial advice.',
    time: '06:05 PM'
  },
  {
    name: 'Entertainment',
    imageURL: 'http://localhost:3000/avatar/Entertainment',
    lastMessage: 'Movie recommendations.',
    time: '09:50 PM'
  }
]

const ListConversation: React.FC = () => {
  const { darkMode } = useTheme()
  return (
    <div className={clsx('bg-opacity-10', { dark: darkMode }, { light: !darkMode })}>
      <div className='flex relative py-2 px-2 bg-grey-lightest items-center'>
        <input
          type='text'
          className={clsx(
            'w-full px-6 py-2 text-sm rounded-xl border outline-gray-600 focus:outline-gray-800 border-gray-600',
            { 'bg-gray-300': !darkMode }
          )}
          placeholder='Search or start new chat'
        />
        <span className='absolute right-7'>
          <IoSearch className='text-gray-500' />
        </span>
      </div>

      {/* <!-- Contacts --> */}
      <div className='bg-grey-lighter flex-1 h-[80vh] overflow-y-auto'>
        {listRoom &&
          listRoom.map((item, index) => {
            return (
              <div
                key={index}
                className={clsx(
                  ' px-3 flex items-center hover:bg-grey-lighter cursor-pointer  rounded-sm',
                  {
                    'bg-[#1F2329]': item?.active && darkMode
                  },
                  { 'bg-[#b3b2b2]': item?.active && !darkMode },
                  {
                    'hover:bg-[#2F343D]': darkMode
                  },
                  {
                    'hover:bg-[#939494]': !darkMode
                  }
                )}
              >
                <div>
                  <img className='h-12 w-12 rounded-full' src={item.imageURL} />
                </div>
                <div className='ml-4 flex-1 border-b border-gray-600 py-4'>
                  <div className='flex items-bottom justify-between'>
                    <p className='text-grey-darkest'>{item.name}</p>
                    <p className='text-xs text-grey-darkest'>{item.time}</p>
                  </div>
                  {/* item.name === 'General' ? listMessage[listMessage.length].msg : item.lastMessage */}
                  <p className='text-grey-dark mt-1 text-sm'>{item.lastMessage}</p>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default ListConversation
