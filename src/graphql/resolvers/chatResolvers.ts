import verifySignature from '../../utils/verifySignature';
import {AuthenticationError} from 'apollo-server-express';

import User, {IUser} from '../../models/User';
import Chat, { IChat, IMessage } from '../../models/Chat';

export default {
    Query: {
        
    },
    Mutation:{
        async getChat(_:any, {chatid}:any,context:any){
            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
            
            return await Chat.findById(chatid);
        },
        async createChat(_:any, { partnerid, partnername}:any, context:any){
            
            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');

            user = <IUser> await User.findById(user.id);
            let partner = <IUser> await User.findById(partnerid);


            let members = [
                {
                    userid: user.id,
                    username: user.username
                },
                {
                    userid: partnerid,
                    username: partnername
                }
            ];

            let newChat = new Chat({
                members,
                messages: []
            });

            let chatSaved = await newChat.save();

            if(user.chats){
                user.chats.push({
                    chatid: chatSaved._id,
                    partnerid,
                    partnername
                });
            }else{
                user.chats = [{
                    chatid: chatSaved._id,
                    partnerid,
                    partnername
                }];
            }
            await user.save();


            if(partner.chats){
                partner.chats.push({
                    chatid: chatSaved._id,
                    partnerid: user._id,
                    partnername: user.username
                });
            }else{
                partner.chats = [{
                    chatid: chatSaved._id,
                    partnerid: user._id,
                    partnername: user.username
                }]
            }

            await partner.save();

            return chatSaved;

        },
        async sendMessage(_:any,{chatid, bodyMessage}:any, context:any){

            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');

            let chat = <IChat> await Chat.findById(chatid);

            let newMessage:IMessage = {
                sender_userid: user.id,
                sender_username: user.username,
                body_message: bodyMessage,
                createdAt: new Date().toISOString()
            }

            chat.messages.unshift(newMessage);

            await chat.save();

            return chat.messages[0];
        }
    }
}
