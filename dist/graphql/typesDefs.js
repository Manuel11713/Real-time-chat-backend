"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = apollo_server_express_1.gql `

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
        id:ID
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
    type Friend{
        userid:ID!
        username: String
    }

    type Message{
        _id:ID, 
        createdAt:String
    }
    type memberChat{
        userid: ID,
        username: String
    }
    type messageChat{
        sender_id: ID,
        sender_username: String,
        body_message: String
        createdAt: String
    }
    type Chat{
        _id:ID
        members: [memberChat],
        messages: [messageChat]
    }
    type ChatUser{
        chatid: String,
        partnerid: ID,
        partnername: String
    }

    type User{
        id: ID!,
        email: String!,
        token: String,
        birthday:String,
        username: String!,
        createdAt: String!,
        chats: [ChatUser]
        friends: [Friend],
    }
    input RegisterInput{
        username:String!,
        password:String!,
        birthday:String!,
        email:String!, 
    }
    type Query{
        getUserbyID(userid:ID):User

        getPost(postid:ID!):Post

        getComments(postid:ID!):[Comment]
    }

    type Mutation{
        getUsers(username:String!):[User]
        getChat(chatid:ID!):Chat!


        register(registerInput:RegisterInput):User!
        login(email:String!, password:String!):User!

        verifyToken(token:String):User!

        addFriend(userid:ID):String
        removeFriend(userid:ID):String

        getPosts(userid:ID!):[Post]

        createPost(body:String, ):Post
        deletePost(postid:ID!):String

        createComment(postid:ID, body:String): Comment
        deleteComment(postid:ID, commentid:ID): String
        
        likePost(postid:ID):String
        removeLikePost(postid:ID):String

        createChat(partnerid:ID!, partnername:String!):Chat!
        sendMessage(chatid:ID!, bodyMessage:String!):Message
    }

`;
exports.default = typeDefs;
