import { useEffect, ReactNode, useState } from 'react'
import { sdk } from '../services/SDK'
import { roomManager } from '../utils/RoomManager'

function SubscriptionProvider({ children }: any): ReactNode {
  const [ready, setReady] = useState(false)
  const roomId = 'GENERAL'

  useEffect(() => {
    roomManager.subscribe(roomId).then()
    const subscribeRoom = async () => {

      // if (sdk.currentSubscription?._id === roomId) {
      //   console.log('subcribe---------')
      //   return
      // }
      if (sdk.currentSubscription) {
        setReady(true)
        return
      }

      const subscription = await sdk.current.subscribeRoom(roomId)
      sdk.currentSubscription = subscription
      setReady(true)
      console.log('🚀 ~ subscribeRoom ~ sdk.currentSubscription:', sdk.currentSubscription)
    }
    subscribeRoom()
  }, [])

  if (!ready) {
    return <div>Loading SubscriptionProvider...</div>
  }
  return <>{children}</>
}

export default SubscriptionProvider
