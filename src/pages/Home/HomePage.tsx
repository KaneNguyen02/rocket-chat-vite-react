import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
// import api, { API_HOST_URL } from "../../api/axiosInstance";
import InputMessage from '../../components/InputMessage/InputMessage'

import { sdk } from '../../services/SDK'
import { IMessage } from '../../utils/constant'
import StorageService from '../../utils/storage'
import { fakeData } from '../../../data'
import clsx from 'clsx'

import { API_BASE_URL, API_HOST_URL } from '../../api/axiosInstance'
import { useMessages } from '../../contexts/MessageContext'
import { RoomManager } from '../../utils/RoomManager'

const HomePage = () => {
  const [inputMessage, setInputMessage] = useState('')
  // const [listMessage, setListMessage] = useState<IMessage[]>([])
  const { listMessage } = useMessages();

  const userId = StorageService.get('id')
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const messageContainerRef = useRef<null | HTMLDivElement>(null)

  const [activeHoverId, setActiveHoverId] = useState<string | null>(null)
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)
  const [isEditMs, setIsEditMs] = useState<boolean>(false)
  const [messageSelected, setMessageSelected] = useState<string>('')

  const { updateMessages } = useMessages();

  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)



  const romId = 'GENERAL'
  const  roomManager = new RoomManager(updateMessages, romId )

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

  // useEffect(() => {
  //   const getHistory = async () => {
  //     // chua lam ham resume nen vao day moi co sdk.current co info login
  //     const generalRoomId = 'GENERAL'
  //     // const history = await sdk.current.methodCall('loadHistory', generalRoomId, null, 30, new Date().toISOString())

  //     // const messageHistory = history.messages
  //     // messageHistory.sort((a: IMessage, b: IMessage) => a.ts.$date - b.ts.$date)
  //     await sdk.getHistory(generalRoomId, 30)
  //     console.log('sdk.historyMessage', sdk.historyMessage);
      
  //     // setListMessage(sdk.historyMessage)
  //   }
  //   getHistory()
  // }, [])





  useEffect(()=>{
    roomManager.subscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (messageContainerRef.current && messageContainerRef.current.scrollTop === 0) {
        loadMoreMessage()
      }
    }
    const messageContainerElement = messageContainerRef.current
    if (messageContainerElement) {
      messageContainerElement.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (messageContainerElement) {
        messageContainerElement.removeEventListener('scroll', handleScroll)
      }
    }
  })

  const loadMoreMessage = async () => {
    console.log('load more message 1111')
    const generalRoomId = 'GENERAL'
    // if (isLoadingMore || !hasMoreMessages) return

    // setIsLoadingMore(true)
    const oldestMessageId = listMessage[0]
    console.log("🚀 ~ loadMoreMessage ~ oldestMessage:", oldestMessageId)

    const history = await sdk.current.methodCall('loadHistory', generalRoomId, oldestMessageId,false, 30)
  
    console.log("🚀 ~ loadMoreMessage ~ history.messages:", history)
    // if (history.messages?.length === 0){
    //   setHasMoreMessages(false)
    //   setIsLoadingMore(false)
    //   return
    // }

    // const historyOldMessage = history.messages
    // setListMessage((prevMessage)=> [...prevMessage, ...historyOldMessage])
    // setIsLoadingMore(false)


  }

  const sendMessage = async (inputMessage: string) => {
    const res = await sdk.current.methodCall('sendMessage', {
      rid: 'GENERAL',
      msg: inputMessage
    })
    console.log('🚀 ~ sendMessage ~ res:', res)
    // setListMessage((prevMessage) => [...prevMessage, res])
    setInputMessage('')
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target?.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (isEditMs) {
        updateMessage(messageSelected, inputMessage)
      } else {
        sendMessage(inputMessage)
      }
    }
  }

  const handleMessage = () => {
    if (isEditMs) {
      updateMessage(messageSelected, inputMessage)
    } else {
      sendMessage(inputMessage)
    }
  }

  const handleEditMessage = (mId: string, oldMessage: string) => {
    setInputMessage(oldMessage)
    setIsEditMs(true)
    setMessageSelected(mId)
  }

  const updateMessage = (mId: string, newContent: string) => {
    const updateMessage = sdk.editMessage(mId, newContent)
    setMessageSelected('')
    setInputMessage('')
    console.log('🚀 ~ updateMessage ~ updateMessage:', updateMessage)
  }

  const handleDeleteMessage = (mId: string) => {
    const deleteMessage = sdk.deleteMessage(mId)
    console.log('🚀 ~ handleDeleteMessage ~ deleteMessage:', deleteMessage)
  }

  return (
    <div className='w-full h-full rounded-2xl bg-gray-100'>
      <div className='flex flex-col w-full h-full flex-shrink-0 '>
        <div ref={messageContainerRef} className='flex flex-col overflow-x-auto mb-4 m-4 h-[76vh] gap-2'>
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
                      src= {`${API_HOST_URL}/avatar/${item.u.username}`}
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
                            <button
                              onClick={() => handleEditMessage(item._id, item.msg)}
                              className='block px-2 py-1 w-full text-gray-800 hover:bg-gray-200 text-sm'
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(item._id)}
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
            })}

          <div ref={messagesEndRef} />
        </div>
      </div>
      <InputMessage
        inputMessage={inputMessage}
        handleChangeInput={handleChangeInput}
        onKeyDown={handleKeyPress}
        handleMessage={handleMessage}
      />
    </div>
  )
}

export default HomePage
