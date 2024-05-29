const express = require("express");
const app = express();
const cors = require("cors");
const conn = require("./db/db");
const { User } = require("./models/user.model");
const { Exercise } = require("./models/exercise.model");
const requestIp = require("request-ip");

const bodyParser = require("body-parser");
require("dotenv").config();

conn(process.env.DATABASE);
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  console.log(requestIp.getClientIp(req));
  res.sendFile(__dirname + "/views/index.html");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/users", async function (req, res) {
  try {
    const { username } = req.body;
    const user = await User.create({ username: username });

    console.log(user);
    res.json({ username: user.username, _id: user._id });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/users/:_id/exercises", async function (req, res) {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;
    const user = await User.findById(_id);
    const exercise = await Exercise.create({
      description: description,
      duration: duration,
      date: date ? new Date(date) : new Date(),
      userId: _id,
    });
    res.json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      _id: user._id,
      date: exercise.date.toDateString(),
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/users", async function (req, res) {
  try {
    const users = await User.find();
    const userArray = users.map((user) => {
      return {
        _id: user._id,
        username: user.username,
      };
    });
    res.json(userArray);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/users/:_id/logs", async function (req, res) {
  try {
    const { _id } = req.params;
      let { from, to, limit } = req.query;
      if(from && to){
      console.log(from);
      console.log(to);

      from = new Date(from);
      to = new Date(to);
      date = `this.date >= ${from} && this.date <= ${to}`;
      const user = await User.findById(_id);
      let exercises = await Exercise.find({
        userId: _id,
        date: {
          $gte: from,
          $lte: to,
        },
      });
      if (limit) {
        exercises = exercises.slice(0, limit);
      }

      console.log(exercises);
      const logs = exercises.map((exercise) => {
        return {
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString(),
        };
      });
      console.log(logs);
      res.json({
        _id: user._id,
        username: user.username,
        count: exercises.length,
        log: logs,
      });
    } else {
      const user = await User.findById(_id);
      const exercises = await Exercise.find({ userId: _id });
      const logs = exercises.map((exercise) => {
        return {
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString(),
        };
      });
      res.json({
        _id: user._id,
        username: user.username,
        count: exercises.length,
        log: logs,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
