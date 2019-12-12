const graphql = require("graphql");
const _ = require("lodash");
const mongoose = require("mongoose");

const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType
} = graphql;

const GenreType = new GraphQLEnumType({
  name: "GenreType",
  values: {
    ACTION: {
      value: "ACTION"
    },
    COMEDY: {
      value: "COMEDY"
    },
    FUNNY: {
      value: "FUNNY"
    }
  }
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        if (mongoose.Types.ObjectId.isValid(parent.authorId)) {
          return Author.findById({ _id: parent.authorId });
        }
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
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GenreType) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
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
    updateBook: {
      type: BookType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        genre: {
          type: new GraphQLNonNull(GenreType)
        }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, genre: args.genre } },
          { new: true }
        ).catch(err => new Error(err));
      }
    },
    deleteBook: {
      type: BookType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args) {
        const removedBook = Book.findByIdAndDelete(args.id).exec();
        if (!removedBook) {
          throw new Error("Error");
        }
        return removedBook;
      }
    },

    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    updateAuthor: {
      type: AuthorType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        age: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(parent, args) {
        return Author.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, age: args.age } },
          { new: true }
        ).catch(err => new Error(err));
      }
    },
    removeAuthor: {
      type: AuthorType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args) {
        const removedAuthor = Author.findByIdAndRemove(args.id).exec();
        if (!removedAuthor) {
          throw new Error("Error");
        }
        return removedAuthor;
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
        return Book.find().limit(10);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      args: {
        page: {
          type: GraphQLInt
        }
      },
      resolve(parent, args) {
        var pageLimit = 10,
          page = Math.max(0, args.page);
        return Author.find()
          .limit(pageLimit)
          .skip(pageLimit * page);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
