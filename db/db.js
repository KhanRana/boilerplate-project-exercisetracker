const mongoose = require("mongoose");
const { User } = require("../models/user.model");
const { Exercise } = require("../models/exercise.model")

const conn = async function (dataBase) {
  try {
    await mongoose.connect(dataBase);
    console.log("connected to the database")
  } catch (error) {
    console.log(error)
  }
}

module.exports = conn;
