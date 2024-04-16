import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import InputMessage from '../../components/InputMessage/InputMessage'
import { sdk } from '../../services/SDK'
import StorageService from '../../utils/storage'

import { useMessages } from '../../providers/MessageProvider'
import { RoomManager } from '../../utils/RoomManager'
import MessageItem from '../../components/MessageItem/MessageItem'
import api, { API_HOST_URL } from '../../api/axiosInstance'
import { AxiosResponse } from 'axios'
import { notifyMessage } from '../../utils/notify'

enum ScrollState {
  LOAD_MORE = 0,
  SENT = 1
}

const HomePage = () => {
  const { listMessage, updateMessages, getMessageScroll, replaceMessageEdit, deleteMessageItem, setListMessage } = useMessages()
  const userId = StorageService.get('id')
  const [inputMessage, setInputMessage] = useState('')

  const [isEditMs, setIsEditMs] = useState<boolean>(false)
  const [messageSelected, setMessageSelected] = useState<string>('')
  const [oldScrollHeight, setOldScrollHeight] = useState<number>(0)
  const [scroll, setScroll] = useState<ScrollState>(ScrollState.LOAD_MORE)

  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const messageContainerRef = useRef<null | HTMLDivElement>(null)

  const romId = 'GENERAL'
  const roomManager = new RoomManager(updateMessages, romId, replaceMessageEdit, deleteMessageItem)

  const roomAvatar = `${API_HOST_URL}/avatar/${romId}`

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView()
    // if (scroll === ScrollState.SENT) {
    //   messagesEndRef.current?.scrollIntoView()
    //   setScroll(ScrollState.LOAD_MORE)
    // }
  }

  useEffect(scrollToBottom, [listMessage])

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
    // if (messageContainerRef.current?.scrollTop === 0) {
    //   const currentScrollHeight = messageContainerRef.current?.scrollHeight
    //   setOldScrollHeight(currentScrollHeight || 0)
    //   loadMoreMessage()
    // }
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
        setScroll(ScrollState.SENT)
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
      setScroll(ScrollState.SENT)
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
    <div className={'w-full h-full rounded-2xl '}>
      <div className='rounded-2xl bg-opacity-20 bg-[url("./login-bg.png")]'>
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
                    fill='#263238'
                    fillOpacity='.5'
                    d='M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z'
                  ></path>
                </svg>
              </div>
              <div className='ml-6'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
                  <path
                    fill='#263238'
                    fillOpacity='.5'
                    d='M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z'
                  ></path>
                </svg>
              </div>
              <div className='ml-6'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
                  <path
                    fill='#263238'
                    fillOpacity='.6'
                    d='M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z'
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div ref={messageContainerRef} className='flex flex-col overflow-x-auto mx-4 mb-4 mt-2 h-[76vh] gap-1 '>
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
