import jwt from 'jsonwebtoken';
import config from '../config';
import {IUser} from '../models/User';

const verifySignature = (context:any) => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer')[1].trim();
        if(token){
            try{
                const user = <string | IUser>jwt.verify(token, config.SECRETKEY);
                return user;
            }catch{
                return null;
            }
        }else return null;
    }else return null;
}

export default verifySignature;