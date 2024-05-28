const {defaule: mongoose, Schema} = require("mongoose");

//creat user schema

const userSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    username: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };