import config from './config';
import app from './app';
import mongoose from 'mongoose';

import { ApolloServer} from 'apollo-server-express';
import typeDefs from './graphql/typesDefs';
import resolvers from './graphql/resolvers';

const server = new ApolloServer({
    typeDefs,
    resolvers
});
server.applyMiddleware({ app });

(async ()=>{
    try{
        const port = process.env.PORT || 5000;
        app.listen(port,()=>{
            console.log('server on port: ',5000);
            console.log('graphql: ',server.graphqlPath);
        });
    }catch{

    }
})();


//init db
(async () => {
    try{
        await mongoose.connect(config.MONGODB.ROUTE, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('mongoose online')
    }catch(e){
        console.log(e)
        console.log('err db');
    }
})();

