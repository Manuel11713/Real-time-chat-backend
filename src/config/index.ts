import dotenv from 'dotenv';
dotenv.config();

const config = {
    db:{
        USERDB:'postgres',
        DATABASE: 'postgres',
        PASSWORDDB: process.env.PASSWORDDB,
        PORT:5432
    }
}

export default config;