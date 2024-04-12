import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { IMessage } from '../utils/constant'
import { sdk } from '../services/SDK'

type MessageContextType = {
  listMessage: IMessage[]
  updateMessages: (newMessage: IMessage) => void
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

      const history = await sdk.getHistory(generalRoomId, 30)
      console.log('🚀 ~ getHistory ~ history:', history)
      setListMessage(history)
    }
    getHistory()
  }, [])

  const updateMessages = (newMessage: IMessage) => {
    setListMessage((prevMessages) => [...prevMessages, newMessage])
  }

  return <MessageContext.Provider value={{ listMessage, updateMessages }}>{children}</MessageContext.Provider>
}

export const useMessages = () => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider')
  }
  return context
}
