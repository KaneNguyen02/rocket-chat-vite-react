import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import InputMessage from '../../components/InputMessage/InputMessage'
import { sdk } from '../../services/SDK'
import StorageService from '../../utils/storage'
import { IoClose, IoPeopleOutline, IoSearch } from 'react-icons/io5'
import { useMessages } from '../../providers/MessageProvider'
import { RoomManager } from '../../utils/RoomManager'
import MessageItem from '../../components/MessageItem/MessageItem'
import api, { API_HOST_URL } from '../../api/axiosInstance'
import clsx from 'clsx'
import { useTheme } from '../../providers/ThemeProvider'
import Members from '../../components/Members/Members'

const HomePage = () => {
  const {
    listMessage,
    updateMessages,
    getMessageScroll,
    replaceMessageEdit,
    deleteMessageItem,
    setListMessage,
    isNewMessage,
    setIsNewMessage
  } = useMessages()
  const userId = StorageService.get('id')
  const [inputMessage, setInputMessage] = useState('')

  const [isEditMs, setIsEditMs] = useState<boolean>(false)
  const [messageSelected, setMessageSelected] = useState<string>('')
  const [oldScrollHeight, setOldScrollHeight] = useState<number>(0)

  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const messageContainerRef = useRef<null | HTMLDivElement>(null)

  const { darkMode } = useTheme()
  const romId = 'GENERAL'
  const roomManager = new RoomManager(updateMessages, romId, replaceMessageEdit, deleteMessageItem)
  const [tabSelected, setTabSelected] = useState<boolean>(false)

  const roomAvatar = `${API_HOST_URL}/avatar/${romId}`

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView()
  }

  useEffect(() => {
    console.log('isNewMessage', isNewMessage)
    scrollToBottom()
    setIsNewMessage(false)
  }, [isNewMessage])

  useEffect(() => {
    console.log('.subscribe')
    roomManager.subscribe()
  }, [])

  const loadMoreMessage = async () => {
    const generalRoomId = 'GENERAL'
    const oldestMessage = listMessage[0]
    const timestamp = oldestMessage?.ts

    const quantityMessage = 10

    await getMessageScroll(generalRoomId, timestamp, quantityMessage)

    requestAnimationFrame(() => {
      if (messageContainerRef.current?.scrollHeight) {
        const newScrollHeight = messageContainerRef.current.scrollHeight
        console.log('new: ', newScrollHeight, 'old', oldScrollHeight)

        const newScrollPosition = newScrollHeight - oldScrollHeight
        messageContainerRef.current?.scrollTo(0, newScrollPosition)
      }
    })
  }

  const handleScroll = () => {
    if (messageContainerRef.current?.scrollTop === 0) {
      const currentScrollHeight = messageContainerRef.current?.scrollHeight
      setOldScrollHeight(currentScrollHeight || 0)
      loadMoreMessage()
    }
  }

  useEffect(() => {
    const messageContainerElement = messageContainerRef.current
    if (messageContainerElement) {
      messageContainerElement.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (messageContainerElement) {
        messageContainerElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  const sendMessage = async (inputMessage: string) => {
    try {
      const res = await sdk.current.methodCall('sendMessage', {
        rid: 'GENERAL',
        msg: inputMessage
      })
      console.log('🚀 ~ sendMessage ~ res:', res)
      setInputMessage('')
    } catch (error) {
      console.error(error)
      setInputMessage('')
    }
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target?.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!inputMessage.trim()) {
        return
      }
      if (isEditMs) {
        updateMessage(messageSelected, inputMessage)
        setIsEditMs(false)
        console.log('isEdit', isEditMs)
      } else {
        sendMessage(inputMessage)
      }
    }
  }

  const handleMessage = () => {
    if (!inputMessage.trim()) {
      return
    }
    if (isEditMs) {
      updateMessage(messageSelected, inputMessage)
      setIsEditMs(false)
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
    sdk.editMessage(mId, newContent)
    setMessageSelected('')
    setInputMessage('')
  }

  const handleDeleteMessage = async (mId: string) => {
    const deleteMessage = await sdk.deleteMessage(mId)
  }

  // console.log('0000', listMessage)
  // bg-[#B3C8CF]
  return (
    <div
      className={clsx('w-full h-full rounded-lg border-l-2 border-gray-600', { dark: darkMode }, { light: !darkMode })}
    >
      <div className={clsx('rounded-2xl  ')}>
        <div className='flex flex-col w-full h-full flex-shrink-0 rounded-2xl backdrop-filter backdrop-blur-lg'>
          {/* <!-- Header --> */}
          <div className='py-2 px-3 z-5 bg-gray-500 flex flex-row justify-between items-center rounded-t-xl bg-opacity-10 backdrop-filter backdrop-blur-lg'>
            <div className='flex items-center'>
              <div>
                <img className='w-10 h-10 rounded-full' src={roomAvatar} />
              </div>
              <div className='ml-4'>
                <p className='text-grey-darkest'>General</p>
                <p className='text-grey-darker text-xs mt-1'>Active now</p>
              </div>
            </div>

            <div className='flex'>
              <div>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
                  <path
                    fill={darkMode ? '#f0f0f0' : '#263238'}
                    fillOpacity='.5'
                    d='M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z'
                  ></path>
                </svg>
              </div>
              <div className='ml-6'>
                <span onClick={() => setTabSelected(!tabSelected)}>
                  <IoPeopleOutline className={clsx('size-6 mr-2')} color={tabSelected ? '#f0f0f0' : '#8B8E90'} />
                </span>
              </div>
              <div className='ml-6'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
                  <path
                    fill={darkMode ? '#f0f0f0' : '#263238'}
                    fillOpacity='.6'
                    d='M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z'
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className='flex flex-row '>
            <div className='flex flex-col basis-3/4 grow'>
              <div
                ref={messageContainerRef}
                className='flex flex-col grow overflow-x-auto mx-4 mb-4 mt-2 h-[76vh] gap-1 '
              >
                {listMessage &&
                  listMessage.map((item, index, arr) => {
                    const isSameUser = item?.u.username === arr[index - 1]?.u.username
                    return (
                      <MessageItem
                        key={item._id}
                        message={item}
                        userId={userId}
                        sameUserPrev={isSameUser}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                      />
                    )
                  })}

                <div ref={messagesEndRef} />
              </div>
              <InputMessage
                inputMessage={inputMessage}
                handleChangeInput={handleChangeInput}
                onKeyDown={handleKeyPress}
                handleMessage={handleMessage}
                darkMode={darkMode}
              />
            </div>

            {/* search members */}
            {tabSelected && <Members onClose={() => setTabSelected(!tabSelected)} darkMode={darkMode} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
