import api from '../api/axiosInstance'
import { useMessages } from '../providers/MessageProvider'
import { sdk } from '../services/SDK'
import { IMessage } from './constant'
import { notifyMessage } from './notify'

export class RoomManager {
  private promise?: Promise<any>
  private timer: any
  private timerDel: any
  private queue: any[] = []
  private queueDel: any[] = []

  private messageListener: any
  private messageDelListener: any
  private rid: string
  private isAlive: boolean = true


  constructor(
    private updateMessages: (message: IMessage) => void,
    rid: string,
    private replaceMessageEdit: (newMessage: IMessage) => void,
    private deleteMessageItem: (mId: string) => void
  ) {
    this.rid = rid
    this.timer = null
    this.isAlive = true
    this.updateMessages = updateMessages
    this.replaceMessageEdit = replaceMessageEdit
    this.deleteMessageItem = deleteMessageItem
  }

  async subscribe() {
    if (this.promise) {
      return await this.unsubscribe()
    }

    this.promise = await sdk.current.subscribeRoom(this.rid)
    console.log('🚀 ~ RoomManager ~ subscribe ~ this.promise:', this.promise)
    // goi api lay room info
    // const info = await api.get(`/api/v1/rooms.info?roomId=${rid}`, )

    if (this.rid) {
      this.messageListener = await sdk.current.onStreamData(
        'stream-room-messages',
        this.handleReceiveMessage.bind(this)
      )
      this.messageDelListener = await sdk.current.onStreamData(
        'stream-notify-room',
        this.handleReceiveMessageDel.bind(this)
      )
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
      this.messageDelListener = null

      try {
        const subscriptions = (await this.promise) || []
        // subscriptions.forEach((sub: any) => sub.current?.unsubscribe().catch(() => console.log('unsubscribeRoom')))
      } catch (e) {
        // do nothing
      }
    }

    this.removeListener(this.messageListener)
    this.removeListener(this.messageDelListener)
    if (this.timer) {
      clearTimeout(this.timer)
    }

    if(this.timerDel) {
      clearTimeout(this.timerDel)
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
    // console.log('🚀 ~ RoomManager ~ handleReceiveMessage ~ this.timer:', this.timer)
    console.log(' this.queue', this.queue)

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
    console.log('message >>>7777', message)
    notifyMessage(message.msg)
    if (message?.editedBy) {
      return this.replaceMessageEdit(message)
    } else {
      return this.updateMessages(message)
    }
  }




  handleReceiveMessageDel(message: any) {
    console.log('del > ', message)

    if (!this.timerDel) {
      // cung timer check var
      this.timerDel = setTimeout(() => {
        this.queueDel.forEach((msg, index) => {
          this.updateListMessageDel(msg, index)
        })

        this.timerDel = null
      }, 150)
    }
    const messageUpdate = message?.fields?.args[0]
    this.queueDel.push(messageUpdate)
  }

  updateListMessageDel(mIdDel: any, index: number) {
    this.queueDel.splice(index, 1)
    notifyMessage(mIdDel._id)
    this.deleteMessageItem(mIdDel._id)
  }
}
