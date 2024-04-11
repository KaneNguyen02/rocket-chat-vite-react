import api from '../api/axiosInstance'
import { sdk } from '../services/SDK'

export class RoomManager {
  private promise?: Promise<any>
  private timer: any
  private queue: any[] = []

  private messageListener: any
  // private rid: string
  private isAlive: boolean = true

  // constructor(rid: string) {
  //   this.rid = rid
    // this.isAlive = true
  //   this.timer = null
  //   this.queue = []
  // }

  async subscribe(rid: string) {
    console.log(await this.promise);
    
    if (await this.promise) {
      console.log('vao day roi');
      
      return await this.unsubscribe()
    }

    console.log('this.promise', this.promise);
    

    this.promise = sdk.current.subscribeRoom(rid)
    // goi api lay room info
    // const info = await api.get(`/api/v1/rooms.info?roomId=${rid}`, )
    // console.log("🚀 ~ RoomManager ~ subscribe ~ info:", info)

    if (rid) {
      console.log("~ rid:", rid)
      this.messageListener = sdk.current.onStreamData('stream-room-messages', this.handleReceiveMessage.bind(this))
      console.log('this.messageListener', this.messageListener);
    }

    if (!this.isAlive) {
      await this.unsubscribe()
    }

    return true
  }

  async unsubscribe() {
    if (await this.promise) {
      console.log('unsubscribingggggggggg');
      
      sdk.current.unsubscribe(this.promise)
      this.messageListener = null
    }

    this.removeListener(this.messageListener)
    if (this.timer) {
      clearTimeout(this.timer)
    }
    return true
  }

  removeListener = async (promise?: Promise<any>): Promise<void> => {
    if (promise) {
      try {
        const listener = await promise
        listener.stop()
      } catch (e) {
        // do nothing
      }
    }
  }

  handleReceiveMessage(message: any) {

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.timer = null
        if (this.queue.length === 0) {
          return
        }

        this.queue.forEach((msg, index) => {
          this.updateMessage(msg)
        })
      }, 150)
    }
    this.queue.push(message)
  }

  updateMessage(message: any) {
    // console.log('message >>>>', message)
  }

  
}

export const roomManager = new RoomManager()
