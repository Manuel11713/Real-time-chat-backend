import {AuthenticationError, UserInputError} from 'apollo-server-express';

import Post, {IPost} from '../../models/Post';
import {IUser} from '../../models/User';
import verifySignature from '../../utils/verifySignature';


export default {
    Query:{
        async getPost(_:any,{postid}:any){
            
            let post = await Post.findById(postid);
            if(!post) return new UserInputError('post not found');
            return post;
           
        },
    },
    Mutation:{
        async getPosts(_:any,{userid}:any,context:any){

            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
            const posts = await Post.find({userid}).sort({createdAt:-1});
            return posts;   
        },
        async createPost(_:any,{body}:any, context:any){
            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');

            const newPost = new Post({
                body,
                userid:user.id,
                username: user.username,
                createdAt: new Date().toISOString(),

            });

            let post = await newPost.save();
            return post;
        },

        async deletePost(_:any,{postid}:any,context:any){

            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');

            const post = <IPost | null> await Post.findById(postid);
            if(!post) return new UserInputError('Wrong post id');

            //Just post owner can delete his post.
            if(post.userid != user.id) return new UserInputError('Action not allowed');

            await post.remove();
            return "Post removed"
        }
    }
}