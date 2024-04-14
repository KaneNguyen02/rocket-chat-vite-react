import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import InputMessage from '../../components/InputMessage/InputMessage'
import { sdk } from '../../services/SDK'
import StorageService from '../../utils/storage'

import { useMessages } from '../../contexts/MessageContext'
import { RoomManager } from '../../utils/RoomManager'
import MessageItem from '../../components/MessageItem/MessageItem'

enum ScrollState {
  LOAD_MORE = 0,
  SENT = 1
}

const HomePage = () => {
  const { listMessage, updateMessages, getMessageScroll, replaceMessageEdit } = useMessages()
  const userId = StorageService.get('id')
  const [inputMessage, setInputMessage] = useState('')

  const [isEditMs, setIsEditMs] = useState<boolean>(false)
  const [messageSelected, setMessageSelected] = useState<string>('')
  const [oldScrollHeight, setOldScrollHeight] = useState<number>(0)
  const [scroll, setScroll] = useState<ScrollState>(ScrollState.LOAD_MORE)

  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const messageContainerRef = useRef<null | HTMLDivElement>(null)

  const romId = 'GENERAL'
  const roomManager = new RoomManager(updateMessages, romId, replaceMessageEdit)

  const scrollToBottom = () => {
    if (scroll === ScrollState.SENT) {
      messagesEndRef.current?.scrollIntoView()
      setScroll(ScrollState.LOAD_MORE)
    }
  }



  useEffect(scrollToBottom, [listMessage])

  useEffect(() => {
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
    const res = await sdk.current.methodCall('sendMessage', {
      rid: 'GENERAL',
      msg: inputMessage
    })
    console.log('🚀 ~ sendMessage ~ res:', res)
    setInputMessage('')
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target?.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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

  const handleDeleteMessage = (mId: string) => {
    const deleteMessage = sdk.deleteMessage(mId)
    console.log('🚀 ~ handleDeleteMessage ~ deleteMessage:', deleteMessage)
  }
  console.log('0000', listMessage)

  return (
    <div className='w-full h-full rounded-2xl bg-gray-100'>
      <div className='flex flex-col w-full h-full flex-shrink-0 '>
        <div ref={messageContainerRef} className='flex flex-col overflow-x-auto mb-4 m-4 h-[76vh] gap-2'>
          {listMessage &&
            listMessage.map((item) => {
              return (
                <MessageItem
                  key={item._id}
                  message={item}
                  userId={userId}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                />
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
