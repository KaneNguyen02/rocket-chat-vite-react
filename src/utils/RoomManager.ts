import api from '../api/axiosInstance'
import { useMessages } from '../contexts/MessageContext'
import { sdk } from '../services/SDK'
import { IMessage } from './constant'

export class RoomManager {
  private promise?: Promise<any>
  private timer: any
  private queue: any[] = []

  private messageListener: any
  private rid: string
  private isAlive: boolean = true

  // constructor(rid: string) {
  // this.rid = rid
  // this.isAlive = true
  //   this.timer = null
  //   this.queue = []
  // }
  constructor(private updateMessages: (message: IMessage) => void, rid: string, private replaceMessageEdit: (newMessage: IMessage) => void) {
    this.rid = rid
    this.updateMessages = updateMessages
    this.replaceMessageEdit = replaceMessageEdit
  }

  async subscribe() {
    if (this.promise) {
      return await this.unsubscribe()
    }

    this.promise = sdk.current.subscribeRoom(this.rid)
    // goi api lay room info
    // const info = await api.get(`/api/v1/rooms.info?roomId=${rid}`, )

    if (this.rid) {
      this.messageListener = sdk.current.onStreamData('stream-room-messages', this.handleReceiveMessage.bind(this))
      console.log('this.messageListener', this.messageListener)
    }

    if (!this.isAlive) {
      await this.unsubscribe()
    }

    return true
  }

  async unsubscribe() {
    this.isAlive = false
    if (await this.promise) {
      console.log('unsubscribingggggggggg')

      sdk.current.unsubscribe(this.promise)
      this.messageListener = null

      try {
        const subscriptions = (await this.promise) || []
        // subscriptions.forEach((sub: any) => sub.current?.unsubscribe().catch(() => console.log('unsubscribeRoom')))
      } catch (e) {
        // do nothing
      }
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
    console.log('🚀 ~ RoomManager ~ handleReceiveMessage ~ this.timer:', this.timer)
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.queue.forEach((msg, index) => {
          this.updateMessage(msg, index)
        })

        this.timer = null
      }, 150)
    }
    const messageUpdate = message.fields?.args[0]
    this.queue.push(messageUpdate)
  }

  updateMessage(message: IMessage, index: number) {
    this.queue.splice(index, 1)
    if (message.editedBy) {
      return this.replaceMessageEdit(message)
    } else {
      return this.updateMessages(message)
    }
  }
}

// export const roomManager = new RoomManager()
