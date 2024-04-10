import { Rocketchat } from '@rocket.chat/sdk';
import { IMessage } from '../utils/constant';

class SDK {
  sdk: Rocketchat
  currentUser: any
  historyMessage: IMessage[]

  connect() {
    this.sdk = new Rocketchat({ 
      host: 'https://wrapper.v2.d-soft.tech', 
      useSsl: true,
      protocol: 'ddp',
      reopen: 20000 
    })
    return this.sdk
  }

  disconnect() {
    if (this.sdk) {
      this.sdk.disconnect()
      this.sdk = null
      this.currentUser = null
    }
    return true
  }

  get current(): Rocketchat {
    return this.sdk || null
  }

  async login(credentials: { username?: string; password?: string; resume?: string; }): Promise<unknown> {
		const res =  await this.current.login(credentials);
    if (res.id && this.current?.currentLogin) {
      this.currentUser = { authToken: this.current?.currentLogin.authToken, ...this.current?.currentLogin?.result?.me }
    }
    return res
	}

  async resume ({ token }: { token: string }) {
    return await this.current.login({ token } as any, {})
  }

	methodCall(method: string, ...args: any[]) {
		return  this.current.callAsync(method, ...args);
	}

	subscribe(topic: string, ...args: any[]) {
		return this.current.subscribe(topic, ...args).ready();
	}

	subscribeRoom(rid: string): Promise<unknown> {
		return Promise.all([
			this.current.subscribe('room-messages', rid),
			this.current.subscribe('notify-room', `${rid}/typing`),
			this.current.subscribe('notify-room', `${rid}/deleteMessage`),
		]);
	}

 
}

export const sdk = new SDK()