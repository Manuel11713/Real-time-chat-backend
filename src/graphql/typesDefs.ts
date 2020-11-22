import { gql } from 'apollo-server-express';

const typeDefs = gql`

    type Post{
        id: ID!,
        body: String,
        createdAt: String,
        username: String,
        comments: [Comment],
        likes: [Like]

        likeCount: Int,
        commentCount: Int
    }
    type Comment{
        id:ID!
        body: String,
        username: String,
        createdAt: String
    }
    type Like{
        id:ID!
        userid:ID!
        username: String,
        createdAt: String
    }

    type User{
        id: ID!,
        email: String!,
        token: String!,
        birthday:String,
        username: String!,
        createdAt: String!,
    }
    input RegisterInput{
        username:String!,
        password:String!,
        birthday:String!,
        email:String!, 
    }
    type Query{
        getPosts:[Post]
        getPost(postid:ID!):Post

        getComments(postid:ID!):[Comment]
    }

    type Mutation{
        getUsers(username:String!):[User]

        register(registerInput:RegisterInput):User!
        login(email:String!, password:String!):User!

        verifyToken(token:String):User!

        createPost(body:String, ):Post
        deletePost(postid:ID!):String

        createComment(postid:ID, body:String): Comment
        deleteComment(postid:ID, commentid:ID): String
        
        likePost(postid:ID):String
        removeLikePost(postid:ID):String
    }

`;

export default typeDefs;