const {default:mongoose} = require("mongoose")

//create schema
const Schema = mongoose.Schema

const exerciseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
}, {
    timestamps: true,
})

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = { Exercise };