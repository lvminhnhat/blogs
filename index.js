
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000;
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql.ts');
const db = require('./database');
require('dotenv').config();


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.listen(port, () => {
  console.log('Example app listening on port 3000!');
});

db.createTables();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
async function startServer() {
  await server.start();
  console.log('Server started!')

  server.applyMiddleware({ app });
}
startServer();


app.get('/', (req, res) => {
  res.send("Hello");
})