export interface IresLogin {
  id: string
  token: string
  tokenExpires: object
  type: string
}

interface IUser {
  _id: string
  username: string
  name: string
}

export interface IMessage {
  _id: string
  rid: string
  msg: string
  ts: {
    $date: number
  }
  u: {
    _id: string
    username: string
    name: string
  }
  unread?: boolean
  _updatedAt: {
    $date: number
  }
  urls: any[]
  mentions: any[]
  channels: any[]
  md: {
    type: string
    value: {
      type: string
      value: string
    }[]
  }[]
  editedAt?: {
    $date: number
  }
  editedBy?: {
    _id: string
    username: string
  }
}

export interface IUserInfo {
  _id: string
  username: string
  emails: {
    address: string
    verified: boolean
  }[]
  roles: string[]
  status: string
  active: boolean
  _updatedAt: string
  name: string
  requirePasswordChange: boolean
  settings: {
    profile: {}
    preferences: any
  }
  statusConnection: string
  avatarETag: string
  avatarOrigin: string
  services: {
    password: {
      exists: boolean
    }
    email2fa: {
      enabled: boolean
    }
  }
  avatarUrl: string
  success: boolean
}
