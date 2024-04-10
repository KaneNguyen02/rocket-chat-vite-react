import { Rocketchat } from '@rocket.chat/sdk';

class SDK {
  sdk: Rocketchat
  currentUser: any

  connect() {
    this.sdk = new Rocketchat({ 
      host: 'https://wrapper.v2.d-soft.tech', 
      useSsl: true,
      // protocol: 'ddp',
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

  async login(credentials: { username: string; password: string }): Promise<unknown> {
		const res =  await this.current.login(credentials);
    if (res.id && this.current?.currentLogin) {
      this.currentUser = { authToken: this.current?.currentLogin.authToken, ...this.current?.currentLogin?.result?.me }
    }
    return res
	}

	methodCall(method: string, ...args: any[]) {
		return this.sdk.callAsync(method, ...args);
	}

	subscribe(topic: string, ...args: any[]) {
		return this.sdk.subscribe(topic, ...args).ready();
	}

	subscribeRoom(rid: string): Promise<unknown> {
		return Promise.all([
			this.subscribe('room-messages', rid, (...args) => this.ev.emit('message', args)),
			this.subscribe('notify-room', `${rid}/typing`, (...args) => this.ev.emit('typing', args)),
			this.subscribe('notify-room', `${rid}/deleteMessage`, (...args) => this.ev.emit('deleteMessage', args)),
		]);
	}

 
}

export const sdk = new SDK()