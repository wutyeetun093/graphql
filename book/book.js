const graphql = require("graphql");
const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;
const books = [
  { name: "The river", genre: "Fantasy", id: "1" },
  { name: "Monkey", genre: "Si=Fi", id: "2" },
  { name: "Apple Inc", genre: "Biography", id: "3" },
  { name: "Steve Jobs", genre: "Biography", id: "4" }
];
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
});
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return _.find(books, { id: args.id });
      }
    }
  }
});
module.exports = new GraphQLSchema({
  query: RootQuery
  // mutation: Mutation
});
