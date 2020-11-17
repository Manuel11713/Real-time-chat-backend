import {model, Schema, Document} from 'mongoose';

export interface IComment{
    _id?:string,
    body: string,
    username: string,
    createdAt: string,
    userid: Schema.Types.ObjectId
}

export interface ILike{
    _id?:string,
    username:string,
    createdAt:string,
    userid: Schema.Types.ObjectId
}

export interface IPost extends Document{
    body: string,
    username: string,
    createdAt: string,
    userid: Schema.Types.ObjectId,
    comments: IComment[],
    likes: ILike[]
}


const postSchema = new Schema({
    body: {type: String, required:true},
    username: {type: String, required:true},
    createdAt: {type: String, required:true},
    userid:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    comments:[
        {
            body: String,
            username: String,
            createdAt: String,
            userid: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            }
        }
    ],
    likes:[{
        username: String,
        createdAt: String,
        userid: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }
    }]
});


export default model('Post',postSchema);