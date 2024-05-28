const {defaule: mongoose} = require("mongoose");

//creat user schema

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };