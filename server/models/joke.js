const mongoose = require("mongoose")
const Schema = mongoose.Schema

const jokeSchema = new Schema({
    joke: String,
    user: {type: Schema.Types.ObjectId, ref:"User"}
})

const Joke = mongoose.model('Joke', jokeSchema)


module.exports = Joke