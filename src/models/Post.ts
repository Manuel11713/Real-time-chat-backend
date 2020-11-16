import {model, Schema} from 'mongoose';

const postSchema = new Schema({
    body: {type: String, required:true},
    username: {type: String, required:true},
    createdAt: {type: String, required:true},
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
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});


export default model('Post',postSchema);