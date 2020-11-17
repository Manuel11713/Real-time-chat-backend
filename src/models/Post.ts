import {model, Schema, Document} from 'mongoose';

interface IComment{
    body:string,
    username:string,
    createdAt:string
}

interface ILike{
    username:string,
    createdAt:string
}

export interface IPost extends Document{
    body: string,
    username: string,
    createdAt: string,
    user: Schema.Types.ObjectId,
    comments: IComment[],
    likes: ILike[]
}


const postSchema = new Schema({
    body: {type: String, required:true},
    username: {type: String, required:true},
    createdAt: {type: String, required:true},
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    comments:[
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes:[{
        username: String,
        createdAt: String
    }]
});


export default model('Post',postSchema);