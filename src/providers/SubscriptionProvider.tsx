import { useEffect, ReactNode, useState } from 'react'
import { sdk } from '../services/SDK'
import { RoomManager } from '../utils/RoomManager'
import { useMessages } from './MessageProvider'
// import { roomManager } from '../utils/RoomManager'

function SubscriptionProvider({ children }: any): ReactNode {
  const [ready, setReady] = useState(false)
  const roomId = 'GENERAL'
  const { listMessage, updateMessages, getMessageScroll, replaceMessageEdit, deleteMessageItem, setListMessage } = useMessages()
  
  useEffect(() => {
    // const roomManager = new RoomManager(updateMessages, roomId, replaceMessageEdit)
    // roomManager.subscribe().then(()=>setReady(true))
    // const subscribeRoom = async () => {

    //   // if (sdk.currentSubscription?._id === roomId) {
    //   //   console.log('subcribe---------')
    //   //   return
    //   // }
    //   if (sdk.currentSubscription) {
    //     setReady(true)
    //     return
    //   }

    //   const subscription = await sdk.current.subscribeRoom(roomId)
    //   sdk.currentSubscription = subscription
    //   setReady(true)
    //   console.log('🚀 ~ subscribeRoom ~ sdk.currentSubscription:', sdk.currentSubscription)
    // }
    // subscribeRoom()
  }, [])

  if (!ready) {
    return  <div className='flex h-screen justify-center items-center'><img src="./loading.svg" alt="loading" className='h-52' /></div>
  }
  return <>{children}</>
}

export default SubscriptionProvider
