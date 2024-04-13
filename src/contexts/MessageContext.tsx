import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { IMessage } from '../utils/constant'
import { sdk } from '../services/SDK'

type MessageContextType = {
  listMessage: IMessage[]
  updateMessages: (newMessage: IMessage) => void
  getMessageScroll: (rid: string, timestamp: { $date: number }, quantityMessage: number) => void
  replaceMessageEdit: (newMessage: IMessage) => void
}

const MessageContext = createContext<MessageContextType | null>(null)

type MessageProviderProps = {
  children: ReactNode
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [listMessage, setListMessage] = useState<IMessage[]>([])

  useEffect(() => {
    const getHistory = async () => {
      const generalRoomId = 'GENERAL'

      const history = await sdk.getHistory(generalRoomId, null, 30)
      console.log('🚀 ~ getHistory ~ history:', history)
      setListMessage(history)
    }
    getHistory()
  }, [])

  const updateMessages = (newMessage: IMessage) => {
    setListMessage((prevMessages) => [...prevMessages, newMessage])
  }


  const replaceMessageEdit = useCallback(
    (messageEdited: IMessage) => {
      return setListMessage((prevMessages) => {
        const newListMessage = [...prevMessages]
        const indexReplace = newListMessage.findIndex((message) => message._id === messageEdited._id)
        if (indexReplace !== -1) {
          newListMessage[indexReplace] = messageEdited
        }
        return [...newListMessage]
      })
    },
    [listMessage]
  )

  const getMessageScroll = async (rid: string, timestamp: { $date: number }, quantityMessage: number) => {
    const historyOldMessage = await sdk.getHistory(rid, timestamp, quantityMessage)
    console.log('historyOldMessage', historyOldMessage)

    setListMessage((prevMessages) => [...historyOldMessage, ...prevMessages])
  }

  return (
    <MessageContext.Provider value={{ listMessage, updateMessages, getMessageScroll, replaceMessageEdit }}>
      {children}
    </MessageContext.Provider>
  )
}

export const useMessages = () => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider')
  }
  return context
}
