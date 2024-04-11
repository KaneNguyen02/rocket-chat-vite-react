import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
// import api, { API_HOST_URL } from "../../api/axiosInstance";
import InputMessage from '../../components/InputMessage/InputMessage'

import { sdk } from '../../services/SDK'
import { IMessage } from '../../utils/constant'
import StorageService from '../../utils/storage'
import { fakeData } from '../../../data'
import clsx from 'clsx'

const HomePage = () => {
  const [inputMessage, setInputMessage] = useState('')
  const [listMessage, setListMessage] = useState<IMessage[]>([])
  // setListMessage(fakeData)
  const userId = StorageService.get('id')
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const [activeHoverId, setActiveHoverId] = useState<string | null>(null)
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)

  const handleMouseEnter = (id: string) => {
    setActiveHoverId(id)
  }

  const handleMouseLeave = () => {
    setActiveHoverId(null)
    setActiveDropdownId(null)
  }

  const handleDotClick = (id: string) => {
    if (activeDropdownId === id) {
      setActiveDropdownId(null)
    } else {
      setActiveDropdownId(id)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [listMessage])

  useEffect(() => {
    const connect = async () => {
      try {
        // console.log("sdk.current()", sdk.current);

        if (!sdk.current) {
          sdk.connect()

          // subscribe room - message event
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    connect()
  }, [])

  useEffect(() => {
    const getHistory = async () => {
      // chua lam ham resume nen vao day moi co sdk.current co info login
      const generalRoomId = 'GENERAL'
      const history = await sdk.current.methodCall('loadHistory', generalRoomId, null, 30, new Date().toISOString())

      const messageHistory = history.messages
      messageHistory.sort((a: IMessage, b: IMessage) => a.ts.$date - b.ts.$date)
      setListMessage(messageHistory)
      console.log('🚀 ~ getHistory ~ messageHistory:', messageHistory)
    }
    getHistory()
  }, [])

  useEffect(() => {
    const subscribeRoom = async () => {
      const roomId = 'GENERAL'
      const subscription = await sdk.current.subscribeRoom(roomId)
      console.log('🚀 ~ subscribeToGeneralRoom ~ messages:', subscription)

      // if (subscription) {
      //   await sdk.current.onMessage((message: any) => {
      //     console.log('Received new message:', message)
      //   })
      // }

      await sdk.current.onStreamData(`stream-room-messages::${roomId}`, (message: any) => {
        console.log('Tin nhắn mới:', message)
      })
    }

    subscribeRoom()
  }, [])

  const sendMessage = async (inputMessage: string) => {
    const res = await sdk.current.methodCall('sendMessage', {
      rid: 'GENERAL',
      msg: inputMessage
    })
    setListMessage((prevMessage) => [...prevMessage, res])
    setInputMessage('')
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target?.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage(inputMessage)
    }
  }

  const handleSendMessage = () => {
    sendMessage(inputMessage)
  }

  return (
    <div className='w-full h-full rounded-2xl bg-gray-100'>
      <div className='flex flex-col w-full h-full flex-shrink-0 '>
        <div className='flex flex-col overflow-x-auto mb-4 m-4 h-[76vh] gap-2'>
          {listMessage &&
            listMessage.map((item) => {
              return (
                <div
                  key={item._id}
                  className={clsx('flex items-center gap-2', {
                    'self-end flex-row-reverse ': item.u._id === userId,
                    'self-start': item.u._id === userId
                  })}
                  onMouseEnter={() => handleMouseEnter(item._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div>
                    <img
                      src='https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144'
                      alt='My profile'
                      className='w-7 h-7 rounded-full order-1'
                    />
                  </div>
                  <div
                    className={
                      item.u._id === userId
                        ? 'self-end text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl max-w-xs w-fit'
                        : ' text-sm bg-white py-2 px-4 shadow rounded-xl max-w-xs w-fit'
                    }
                  >
                    <p className='font-thin '>{item.u.name}</p>
                    <div className=''>{item.msg}</div>
                  </div>
                  <div className='relative'>
                    <div className='text-[12px]'>{new Date(item.ts.$date).toLocaleTimeString()}</div>
                    {activeHoverId === item._id && (
                      <div className='absolute -top-5 -left-8  px-4 py-3'>
                        <button onClick={() => handleDotClick(item._id)} className='text-gray-500 hover:text-gray-800'>
                          ...
                        </button>
                        {activeDropdownId == item._id && (
                          <div className='absolute top-0 left-0 mt-8 bg-white border rounded-md shadow-md'>
                            <button className='block px-2 py-1 w-full text-gray-800 hover:bg-gray-200 text-sm'>
                              Edit
                            </button>
                            <button className='block px-2 py-1 w-full text-gray-800 hover:bg-gray-200 text-sm'>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

          <div ref={messagesEndRef} />
        </div>
      </div>
      <InputMessage
        inputMessage={inputMessage}
        handleChangeInput={handleChangeInput}
        onKeyDown={handleKeyPress}
        handleSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default HomePage
