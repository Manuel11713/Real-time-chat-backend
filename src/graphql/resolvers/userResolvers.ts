import bcrypt from 'bcryptjs';
import {UserInputError, AuthenticationError} from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import config from '../../config';
import {validateLogin, validateRegister} from '../../helpers/validatorUser';
import verifySignature from '../../utils/verifySignature';


//Models
import User,{IUser} from '../../models/User';

export default {
    Query:{
        async getUserbyID(_:any,{userid}:any){
            let userDB = await User.findById(userid);
            return userDB;
        },  
    },

    Mutation:{
        async verifyToken(_:any, {token}:any) {
            let user = await jwt.verify(token,config.SECRETKEY);
            return user;
        },

        async addFriend(_:any, {userid}:any,context:any){
            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
            
            let userDB = <IUser> await User.findById(user.id);
            let friendToAdd = <IUser> await User.findById(userid);
            
            if(!userDB.friends) userDB.friends = [{userid}];
            else userDB.friends.push({userid});

            if(!friendToAdd.friends) friendToAdd.friends = [{userid:user.id}];
            else friendToAdd.friends.push({userid:user.id});
            
            await userDB.save();
            await friendToAdd.save();
            
            return 'Added';
        },
        async removeFriend(_:any, {userid}:any,context:any){
            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
            
            let userDB = <IUser> await User.findById(user.id);
            let friendToRemove = <IUser> await User.findById(userid);

            //User of token
            let userReqId = user.id;
            
            if(!userDB.friends && !friendToRemove.friends) return "Removed";

            userDB.friends =  userDB.friends.filter(friend => friend.userid != userid);
            friendToRemove.friends =  friendToRemove.friends.filter(friend => friend.userid != userReqId);

            await userDB.save();
            await friendToRemove.save();

            return 'Removed';
        },
        async getUsers(_:any,{username}:any){
            if(username.trim().length === 0)return new UserInputError('username must be not empty');

            let users:IUser[] = <IUser[]> await User.find({username:{$regex:username}});
            return users;
        },
        async login(_:string,{email, password}:any){
            
            //Validate User data
            const {valid, errors} = validateLogin(email, password);
            if(!valid) return new UserInputError('Wrong data',errors); 

            //-----Make sure user exists already.
            const user:(IUser | null) = <IUser | null> await User.findOne({email});
            if(!user) return new UserInputError("Check your email and password"); //Wrong email.

            //-----Compare input password vs password in db.
            const match = await bcrypt.compare(password, user.password);
            if(!match) return new UserInputError("Check your email and password"); //Wrong password.

            //-----Token
            const token = jwt.sign({
                id: user._id,
                email: user.email,
                username: user.username
            },config.SECRETKEY,{expiresIn:'3d'});

            return {
                id: user._id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                token,
            }
        },

        async register(parent:any, {registerInput:{username,password,email, birthday}}:any, context:any, info:any){
            //Validate User data
            const {valid, errors} = validateRegister(username, email, password);
            if(!valid) return new UserInputError('Wrong data',errors);
            
            //-----Make sure user doesn't exists already.
            const user = await User.findOne({email});
            if(user) return new UserInputError('User already in database',{
                errors:{
                    email:'email already in database'
                }
            });

            //-----Hash password and create an auth token.
            const hash = await bcrypt.hash(password,12);
            const newUser:IUser = <IUser> new User({
                username,
                password:hash,
                email,
                birthday,
                createdAt: new Date().toISOString()
            });
             
            const res = await newUser.save();
            
            const token = jwt.sign({
                id: res._id,
                email: res.email,
                username: res.username
            },config.SECRETKEY,{expiresIn:'3d'});


            return {
                id: res._id,
                email: res.email,
                birthday,
                username: res.username,
                createdAt: res.createdAt,
                token,
            }
        }
    }
}