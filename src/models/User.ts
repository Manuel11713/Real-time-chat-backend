import {model, Schema, Document} from 'mongoose';

interface Friend{
    userid: string,
    username: string
}
interface Chat{
    chatid: string,
    partnerid: string,
    partnername: string
}

export interface IUser extends Document{
    username:string,
    password:string,
    email:string,
    friends:Friend[],
    chats:Chat[],
    birthday:string,
    createdAt:string
}

const userSchema = new Schema({
    username: {type:String, required:true},
    password: {type:String, required:true},
    birthday: {type:String},
    friends : [{
        userid: {type: Schema.Types.ObjectId},
        username: {type: String}
    }],
    chats: [{
        chatid: {type: String},
        partnerid: {type: Schema.Types.ObjectId},
        partnername: {type: String}

    }],
    email: {type:String, required:true, unique:true},
    createdAt: {type:String, required:true},

});


export default model('User',userSchema);