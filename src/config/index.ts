import dotenv from 'dotenv';
dotenv.config();

const config = {
    MONGODB:{
        ROUTE:process.env.MONGODBROUTE || 'mongodb://localhost:27017/social-media-app'
    },
    SECRETKEY: process.env.SECRETKEY || 'some-secret'
}

export default config;