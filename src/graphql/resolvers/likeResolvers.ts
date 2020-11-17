import {AuthenticationError, UserInputError} from 'apollo-server-express';

import Post, {ILike,IPost} from '../../models/Post';
import {IUser} from '../../models/User';
import verifySignature from '../../utils/verifySignature';

export default {
    Mutation:{
        async likePost(_:any, {postid}:any, context:any){

            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
        
            const post = <IPost | null> await Post.findById(postid);
            if(!post) return new UserInputError('Wrong post id');
            
            //Search if you gived like to this post.
            let userid = user.id;
            let idxUser = post.likes.findIndex(like=>like.userid == userid);  
            if(idxUser != -1) return new UserInputError('you gived like to this post already');

            let newLike:ILike = {
                userid,
                username:user.username,
                createdAt: new Date().toISOString()
            };

            post.likes.unshift(newLike);
            await post.save();

            return 'Liked';
        },

        async removeLikePost(_:any, {postid}:any, context:any){
            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
        
            const post = <IPost | null> await Post.findById(postid);
            if(!post) return new UserInputError('Wrong post id');
            
            //Search if you gived like to this post.
            let userid = user.id;
            post.likes = post.likes.filter(like => like.userid != userid);

            await post.save();

            return "Like Removed";
        }
    }
}