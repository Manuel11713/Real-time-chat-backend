import {model, Schema, Document} from 'mongoose';


export interface IUser extends Document{
    username:string,
    password:string,
    email:string,
    birthday:string,
    createdAt:string
}

const userSchema = new Schema({
    username: {type:String, required:true},
    password: {type:String, required:true},
    birthday: {type:String},
    email: {type:String, required:true, unique:true},
    createdAt: {type:String, required:true},

});


export default model('User',userSchema);