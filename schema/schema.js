const graphql = require("graphql");
const _ = require("lodash");

const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;
// const books = [
//   { name: "The river", genre: "Fantasy", id: "1", authorId: "1" },
//   { name: "Monkey", genre: "Si=Fi", id: "2", authorId: "1" },
//   { name: "Apple Inc", genre: "Biography", id: "3", authorId: "2" },
//   { name: "Steve Jobs", genre: "Biography", id: "4", authorId: "3" }
// ];
// const authors = [
//   { name: "Mg Mg", age: "26", id: "1" },
//   { name: "Su Su", age: "27", id: "2" },
//   { name: "Hla Hla", age: "30", id: "3" },
//   { name: "Mg Ba", age: "50", id: "4" }
// ];
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // return Author.findById({ _id: parent.authorId });
        return Author.findOne();
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    }
  }
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
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },
    getBooksByAuthor: {
      type: new GraphQLList(BookType),
      args: {
        authorId: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return Book.find({ authorId: args.authorId });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find();
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
