import server from './sockets/index';
import clientpg from './database';

//init db
(async () => {
    try{
        await clientpg.connect();
        console.log('db online')
    }catch(e){
        console.log(e)
        console.log('err db');
    }
})();



//init app
const port = process.env.PORT || 5000;
server.listen(port,()=>console.log('Server on port:',port))