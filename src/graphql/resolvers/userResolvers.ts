import bcrypt from 'bcryptjs';
import {UserInputError} from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import config from '../../config';
import {validateLogin, validateRegister} from '../../helpers/validatorUser';

//Models
import User,{IUser} from '../../models/User';

export default {
    Mutation:{
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

        async register(parent:any, {registerInput:{username,password,email}}:any, context:any, info:any){
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
                username: res.username,
                createdAt: res.createdAt,
                token,
            }
        }
    }
}