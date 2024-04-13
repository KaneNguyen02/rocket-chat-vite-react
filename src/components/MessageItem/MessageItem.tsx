import React, { useState } from 'react'
import { IMessage } from '../../utils/constant'
import { API_HOST_URL } from '../../api/axiosInstance'
import clsx from 'clsx'

interface IMessageItemProps {
  message: IMessage
  userId: string
  onEdit: (mId: string, oldMessage: string) => void
  onDelete: (mId: string) => void
}

const MessageItem: React.FC<IMessageItemProps> = ({ message, userId, onEdit, onDelete }) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [activeDropdown, setActiveDropdownId] = useState<boolean>(false)

  return (
    <div
      key={message._id}
      className={clsx('flex items-center gap-2', {
        'self-end flex-row-reverse ': message.u._id === userId,
        'self-start': message.u._id === userId
      })}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div>
        <img
          src={`${API_HOST_URL}/avatar/${message.u.username}`}
          alt='My profile'
          className='w-7 h-7 rounded-full order-1'
        />
      </div>
      <div
        className={
          message.u._id === userId
            ? 'self-end text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl max-w-xs w-fit'
            : ' text-sm bg-white py-2 px-4 shadow rounded-xl max-w-xs w-fit'
        }
      >
        <p className='font-light '>{message.u.name}</p>
        <div className=''>{message.msg}</div>
        {message.editedBy && (
          <>
            <div className='text-[14px] text-gray-600 italic'>Edit by: {message.editedBy?.username}</div>
            {/* <div className=''>Edit at: {new Date(item.editedAt?.$date).toLocaleString()}</div> */}
          </>
        )}
      </div>
      <div className='relative'>
        <div className='text-[12px]'>{new Date(message.ts.$date).toLocaleTimeString()}</div>
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
  )
}

export default MessageItem
