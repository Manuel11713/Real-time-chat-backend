import postResolvers from './postResolvers';
import userResolvers from './userResolvers';

export default {
    Query:{
        ...postResolvers.Query,
    },
    Mutation:{
        ...userResolvers.Mutation
    }
}