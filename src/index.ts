import server from './sockets/index';
import mongoose from 'mongoose';

//init db
(async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/social-media-app', {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('mongoose online')
    }catch(e){
        console.log(e)
        console.log('err db');
    }
})();


//init app
const port = process.env.PORT || 5000;
server.listen(port,()=>console.log('Server on port:',port))