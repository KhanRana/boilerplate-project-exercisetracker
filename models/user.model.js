const {default: mongoose} = require("mongoose");

//create user schema
const Schema = mongoose.Schema

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };