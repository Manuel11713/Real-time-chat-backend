"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const graphql_yoga_1 = require("graphql-yoga");
const apollo_server_express_1 = require("apollo-server-express");
const typesDefs_1 = __importDefault(require("./graphql/typesDefs"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const pubsub = new graphql_yoga_1.PubSub();
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: typesDefs_1.default,
    resolvers: resolvers_1.default,
    context: ({ req }) => ({ req, pubsub })
});
server.applyMiddleware({ app: app_1.default });
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const port = process.env.PORT || 5000;
        app_1.default.listen(port, () => {
            console.log('server on port: ', 5000);
            console.log('graphql: ', server.graphqlPath);
        });
    }
    catch (_a) {
    }
}))();
//init db
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.set("useCreateIndex", true); //This fix: $ (node:9613) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
        yield mongoose_1.default.connect(config_1.default.URIMONGO.ROUTE, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('mongoose online');
    }
    catch (e) {
        console.log(e);
        console.log('err db');
    }
}))();
