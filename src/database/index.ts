import pg from 'pg';
import config from '../config';


const clientpg = new pg.Client({
    user: config.db.USERDB,
    database:config.db.DATABASE,
    password:config.db.PASSWORDDB,
    port: config.db.PORT
});

export default clientpg;
