const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb+srv://root:root@cluster0-euj5e.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

mongoose.connection.once("open", () => {
  console.log("database is connected");
});

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
