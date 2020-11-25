import dotenv from 'dotenv';
dotenv.config();

const config = {
    URIMONGO:{
        ROUTE:process.env.URIMONGO || 'mongodb://localhost:27017/social-media-app'
    },
    SECRETKEY: process.env.SECRETKEY || 'some-secret'
}

export default config;