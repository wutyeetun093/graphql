const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.set("useCreateIndex", true);

const bookSchema = new Schema({
  name: { type: String, unique: true },
  genre: String,
  authorId: String
});

module.exports = mongoose.model("Book", bookSchema);
