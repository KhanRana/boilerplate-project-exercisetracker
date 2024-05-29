const express = require('express')
const app = express()
const cors = require('cors')
const conn = require('./db/db');
const { User } = require('./models/user.model');
const { Exercise } = require('./models/exercise.model');

const bodyParser = require("body-parser");
require("dotenv").config();

conn(process.env.DATABASE);
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/users", async function (req, res) {
  try {
    const {username} = req.body;
    const user = await User.create({username: username});
    console.log(user);
    res.json({username: user.username, _id: user._id});
  } catch (error) {
    console.log(error);
  }
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
