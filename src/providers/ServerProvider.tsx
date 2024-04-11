import { Fragment, ReactNode, useEffect, useState } from 'react'
import { sdk } from '../services/SDK'

function ServerProvider({ children }: any): ReactNode {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const socket = sdk.current
    if (!socket) {
      console.log(socket);
      
      try {
        sdk.connect()
        console.log('000', sdk.current);
        setReady(true)
        
      } catch (error) {
        sdk.disconnect()
        alert('connecting to server failure!')
        setReady(false)
      }
    }
  })

  if (!ready) {
    return <div>Loading...</div>
  }

  return <Fragment>{children}</Fragment>
}

export default ServerProvider
