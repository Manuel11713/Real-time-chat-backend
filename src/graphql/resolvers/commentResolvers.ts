import {AuthenticationError, UserInputError} from 'apollo-server-express';

import Post, {IComment, IPost} from '../../models/Post';
import {IUser} from '../../models/User';
import verifySignature from '../../utils/verifySignature';


export default {
    Mutation: {

        async createComment(_:any, {postid, body}:any,context:any){

            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');

            const post = <IPost | null> await Post.findById(postid);
            if(!post) return new UserInputError('Wrong post id');

            let newComment:IComment = {
                body,
                username: user.username,
                userid: user.id,
                createdAt: new Date().toISOString()
            }
            post.comments.unshift(newComment);
            await post.save();
            return newComment;
        },

        async deleteComment(_:any, {postid, commentid}:any, context:any){
            let user:(IUser | string | null) = verifySignature(context);  
            if(!user || typeof user === 'string') return new AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');

            const post = <IPost | null> await Post.findById(postid);
            if(!post) return new UserInputError('Wrong post id');


            let idxComment = post.comments.findIndex(comment=>comment._id == commentid);
            if(idxComment == -1) return new UserInputError('Wrong comment id');

            //Just owner post and owner comment can delete the comment.
            if(user.id != post.userid && user.id != post.comments[idxComment].userid) return new AuthenticationError('Action not allowed');

            post.comments.splice(idxComment,1);
            await post.save();

            return 'Comment Deleted';
        }
    }
}