import {model, Schema, Document} from 'mongoose';


export interface IUser extends Document{
    username:string,
    password:string,
    email:string,
    createdAt:string
}

const userSchema = new Schema({
    username: {type:String, required:true},
    password: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    createdAt: {type:String, required:true},

});


export default model('User',userSchema);