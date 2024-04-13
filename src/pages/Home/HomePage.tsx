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
import MessageItem from '../../components/MessageItem/MessageItem'

const HomePage = () => {
  const [inputMessage, setInputMessage] = useState('')
  // const [listMessage, setListMessage] = useState<IMessage[]>([])
  const { listMessage } = useMessages()

  const userId = StorageService.get('id')
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const messageContainerRef = useRef<null | HTMLDivElement>(null)

  const [isEditMs, setIsEditMs] = useState<boolean>(false)
  const [messageSelected, setMessageSelected] = useState<string>('')

  const { updateMessages, getMessageScroll, replaceMessageEdit } = useMessages()

  const romId = 'GENERAL'
  const roomManager = new RoomManager(updateMessages, romId, replaceMessageEdit)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView()
  }

  useEffect(scrollToBottom, [listMessage])

  useEffect(() => {
    roomManager.subscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      console.log('messageContainerRef.current.scrollTop', messageContainerRef.current?.scrollTop);
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
  }, [])

  const loadMoreMessage = async () => {
    const generalRoomId = 'GENERAL'
    const oldestMessage = listMessage[0]
    const timestamp = oldestMessage.ts

    const quantityMessage = 10
    getMessageScroll(generalRoomId, timestamp, quantityMessage)
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
        setIsEditMs(false)
        console.log('isEdit', isEditMs)
      } else {
        sendMessage(inputMessage)
      }
    }
  }

  const handleMessage = () => {
    if (isEditMs) {
      updateMessage(messageSelected, inputMessage)
      setIsEditMs(false)
      console.log('isEdit', isEditMs)
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
