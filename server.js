const { ApolloServer, gql, PubSub } = require("apollo-server");
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const getOrCreateUser = require("./controllers/userController");
const mongoose = require("mongoose");
require("./models/User");
require("./models/Comment");
const Pin = require("./models/Pin");
require("dotenv").config();

mongoose
  .connect(process.env.MONGOURL, { useNewUrlParser: true })
  .then(() => console.log("connected to mongo"))
  .catch(e => console.log(e));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,


  context: async ({ req ,res, connection}) => {


    if (connection) {
      return {
        ...connection.context
      }
    }
    const token = req.headers.authorization;
    if (!token) throw new Error("you must be authanicated") 
    const user = await getOrCreateUser(token);

    return   {user};
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket, context) => {
      if (!connectionParams.authToken) throw new Error("you must be authanicated") 
      try {

         await getOrCreateUser(connectionParams.authToken);

        
      } catch (error) {
        throw new Error("you must be authanicated") 
        
      }

   
    },
    onDisconnect:  (webSocket, context) => {
      //console.log(`Subscription client disconnected.`)
    }
   }

});
server.listen({ port: 8080 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
