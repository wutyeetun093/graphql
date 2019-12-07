const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./book/book");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen("5000", () => {
  console.log("API server is running");
});
