import { IMessage } from "./src/utils/constant";

export const fakeData: IMessage[] = [{
    _id: "message_id_123",
    rid: "room_id_456",
    msg: "This is a test message.",
    ts: { $date: Date.now() },
    u: {
        _id: "user_id_789",
        username: "example_user",
        name: "Example User"
    },
    unread: true,
    _updatedAt: { $date: Date.now() },
    urls: [],
    mentions: [],
    channels: [],
    md: [
        {
            type: "text",
            value: [
                { type: "plain", value: "This is a test message." }
            ]
        }
    ]
}];

console.log(fakeData);
