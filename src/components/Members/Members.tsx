import React, { ChangeEvent, useEffect, useState } from 'react'
import { IoClose, IoPeopleOutline, IoSearch } from 'react-icons/io5'
import api, { API_HOST_URL } from '../../api/axiosInstance'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import clsx from 'clsx'

interface IMember {
  _id: string
  status: string
  _updatedAt: string
  name: string
  username: string
  nickname: string
  avatarETag: string
}

export const Members: React.FC<{ onClose: () => void; darkMode: boolean }> = ({ onClose, darkMode }) => {
  const [optionSelected, setOptionSelected] = useState('All')
  const [inputValue, setInputValue] = useState('')
  const [members, setMembers] = useState<IMember[]>([])
  const [membersFilter, setMembersFilter] = useState<IMember[]>([])

  const handleChangeOption = (e: ChangeEvent<HTMLSelectElement>) => {
    const valueSelected = e.target.value
    setOptionSelected(valueSelected)

    if (valueSelected === 'all') {
      setMembersFilter([...members])
    } else {
      const filteredMembers = members.filter((item) => item.status === valueSelected)
      setMembersFilter(filteredMembers)
    }
  }
  const romId = 'GENERAL'

  useEffect(() => {
    api.get(`/api/v1/channels.members?roomId=${romId}`).then((result) => {
      console.log(result.data.members)
      setMembers(result.data.members)
      setMembersFilter(result.data.members)
    })
  }, [])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.target.value
    setInputValue(currentInput)
    if (currentInput.trim() === '') {
      return setMembersFilter([...members])
    }
    const searchMembers = members.filter((item) => item.name.toLowerCase().includes(currentInput.toLowerCase()))
    setMembersFilter([...searchMembers])
  }
  return (
    <div className='border-l-gray-900 border-l-2'>
      <div className='basis-1/3 shrink'>
        <div className='flex flex-col'>
          <div className='flex justify-between border border-l-0 border-r-0 border-gray-600 p-4'>
            <div className='flex items-center'>
              <span>
                <IoPeopleOutline className='size-6 mr-2' />
              </span>
              <div className='font-bold'>Members</div>
            </div>
            <IoClose onClick={() => onClose()} className='size-6' />
          </div>

          <div className='flex p-4 pb-0 gap-5 justify-between'>
            <div className='relative basis-2/3'>
              <div>
                <input
                  type='text'
                  className={clsx(
                    'w-full px-6 py-2 text-sm rounded-md border outline-blue-400 bg-[#2f343d] text-[#f0f0f0]',
                    {
                      'bg-[#2F343D] text-[#f0f0f0]': darkMode
                    },
                    { 'bg-gray-200 text-[#2F343D]': !darkMode }
                  )}
                  placeholder='Search by username'
                  value={inputValue}
                  onChange={handleSearch}
                />
              </div>
              <div className='absolute right-6 top-3'>
                <IoSearch className='text-gray-500' />
              </div>
            </div>

            <div className='mb-2 sm:mb-6 basis-1/3'>
              <select
                id='statusType'
                className={clsx(
                  'border bg-[#2f343d] text-sm text-[#f0f0f0] rounded-md block w-full p-2.5',
                  {
                    'bg-[#2F343D] text-[#f0f0f0]': darkMode
                  },
                  { 'bg-gray-200 text-[#2F343D]': !darkMode }
                )}
                value={optionSelected}
                onChange={(e) => handleChangeOption(e)}
                required
              >
                <option key='online' value='online'>
                  Online
                </option>{' '}
                <option key='busy' value='busy'>
                  Busy
                </option>{' '}
                <option key='away' value='away'>
                  Away
                </option>{' '}
                <option key='all' value='all'>
                  All
                </option>
              </select>
            </div>
          </div>

          <div className='flex flex-col p-4'>
            <div className=''>
              Show {membersFilter.length} of {members.length}
            </div>
            {membersFilter &&
              membersFilter.map((item, index) => {
                return (
                  <div key={index} className='flex justify-between hover:bg-[rgb(26,30,35)] items-center'>
                    <div className='flex gap-3 items-center p-1'>
                      <div>
                        {' '}
                        <img
                          className='h-7 rounded-md'
                          src={`${API_HOST_URL}/avatar/${item.username}?${new Date().getTime()}`}
                          alt=''
                        />
                      </div>
                      <div className=''>{item.name}</div>
                    </div>
                    <div className='group mr-4'>
                      <HiOutlineDotsVertical className='hover:bg-gray-500 rounded-sm ' />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Members
