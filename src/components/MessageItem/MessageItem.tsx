import React, { useState } from 'react'
import { IMessage } from '../../utils/constant'
import { API_HOST_URL } from '../../api/axiosInstance'
import clsx from 'clsx'
import moment from 'moment'

interface IMessageItemProps {
  message: IMessage
  userId: string
  sameUserPrev: boolean
  onEdit: (mId: string, oldMessage: string) => void
  onDelete: (mId: string) => void
}

const MessageItem: React.FC<IMessageItemProps> = ({ message, userId, sameUserPrev, onEdit, onDelete }) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [activeDropdown, setActiveDropdownId] = useState<boolean>(false)
  const isSelf = message.u._id === userId

  const messageTime = moment(message.ts.$date);
  const isToday = messageTime.isSame(moment(), 'day');
  const formattedDateTime = isToday ? messageTime.format('HH:mm') + ' Today' : messageTime.format('D MMM YYYY, HH:mm');

  return (
    <div key={message._id} className=' '>
      {!sameUserPrev && (
        <span className='flex justify-center'>
          <p className='text-sm opacity-70'>{formattedDateTime}</p>
        </span>
      )}
      <div className='flex flex-col'>
        <div className={clsx({ 'self-end mr-9': isSelf }, { 'self-start ml-9': !isSelf })}>
          {' '}
          {!sameUserPrev && <p className=' '>{message.u.name}</p>}
        </div>
        <div
          className={clsx('flex items-center gap-2', {
            'self-end flex-row-reverse ': isSelf,
            'self-start': !isSelf
          })}
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
        >
          <div className='w-7 h-7'>
            {!sameUserPrev && (
              <img
                src={`${API_HOST_URL}/avatar/${message.u.username}`}
                alt='My profile'
                className=' rounded-full order-1'
              />
            )}
          </div>

          <div className={isSelf ? 'self-end text-sm max-w-lg w-fit' : 'text-sm  max-w-lg  w-fit'}>
            <div
              className={clsx('px-4 py-2 ', {
                'bg-[#0A7CFF] text-white rounded-tl-3xl rounded-tr-2xl rounded-br-sm rounded-bl-3xl': isSelf,
                'bg-[#F0F0F0] opacity-80 backdrop-filter backdrop-blur-sm rounded-tl-2xl rounded-tr-3xl rounded-br-3xl rounded-bl-sm': !isSelf
              })}
            >
              <p>{message.msg}</p>
            </div>
          </div>

          <div className='relative'>
            {/* <div className='text-[12px]'>{new Date(message.ts.$date).toLocaleTimeString()}</div> */}
            {isActive && (
              <div className='absolute -top-5 -left-8  px-4 py-3'>
                <button onClick={() => setActiveDropdownId(true)} className='text-gray-500 hover:text-gray-800'>
                  ...
                </button>
                {activeDropdown && (
                  <div className='absolute top-0 left-0 mt-8 bg-white border rounded-md shadow-md'>
                    <button
                      onClick={() => onEdit(message._id, message.msg)}
                      className='block px-2 py-1 w-full text-gray-800 hover:bg-gray-200 text-sm'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(message._id)}
                      className='block px-2 py-1 w-full text-gray-800 hover:bg-gray-200 text-sm'
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {message.editedBy && (
          <div
            className={clsx(
              'text-[12px] text-gray-600 italic ',
              { 'self-end mr-9': isSelf },
              { 'self-start ml-9': !isSelf }
            )}
          >
            Edit by: {message.editedBy?.username}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageItem
