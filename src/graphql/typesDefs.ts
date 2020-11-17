import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Post{
        id: ID!,
        body: String,
        createdAt: String,
        username: String,

    }
    type User{
        id: ID!,
        email: String!,
        token: String!,
        username: String!,
        createdAt: String!,
    }
    input RegisterInput{
        username:String!,
        password:String!,
        email:String!, 
    }
    type Query{
        getPosts:[Post]
        getPost(postid:ID!):Post
    }

    type Mutation{
        register(registerInput:RegisterInput):User!
        login(email:String!, password:String!):User!
        createPost(body:String, ):Post
        deletePost(postid:ID!):String
    }

`;

export default typeDefs;