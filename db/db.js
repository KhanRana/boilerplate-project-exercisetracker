const mongoose = require("mongoose");

const connect = async function main() {
  await mongoose.connect("mongodb://localhost:27017/fruitsDB");
}.catch((err) => console.log(err));

module.exports = connect;
