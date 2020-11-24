import { Document, Schema, model } from 'mongoose';

interface Member {
    userid: Schema.Types.ObjectId,
    username: string
}

export interface IMessage{
    sender_userid: Schema.Types.ObjectId,
    sender_username: string,
    body_message: string,
    createdAt: string
}

export interface IChat extends Document{
    members: Member[],
    messages: IMessage[]
}


const ChatSchema = new Schema({
    members: [{
        userid: {type: Schema.Types.ObjectId},
        username: {type: String}
    }],

    messages: [{
        sender_userid: {type: Schema.Types.ObjectId},
        sender_username: {type: String},
        body_message: {type: String},
        createdAt: {type: String}
    }]
});

export default model('Chat', ChatSchema);