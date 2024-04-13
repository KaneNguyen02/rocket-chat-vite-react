export interface IresLogin {
  id: string;
  token: string;
  tokenExpires: object;
  type: string;
}


interface IUser {
  _id: string;
  username: string;
  name: string;
}



export interface IMessage {
    _id: string;
    rid: string;
    msg: string;
    ts: {
      $date: number;
    };
    u: {
      _id: string;
      username: string;
      name: string;
    };
    unread?: boolean;
    _updatedAt: {
      $date: number;
    };
    urls: any[];
    mentions: any[];
    channels: any[];
    md: {
      type: string;
      value: {
        type: string;
        value: string;
      }[];
    }[];
    editedAt?: {
      $date: number;
    };
    editedBy?: {
      _id: string;
      username: string;
    };
  }
