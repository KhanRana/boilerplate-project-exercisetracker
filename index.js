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

app.get("/api/users/:_id/logs", (req, res) => {
  // get user id from params and check that it won't break the DB query
  const { _id } = req.params;
  if (_id.length !== 24) {
    return res.json({ error: "User ID needs to be 24 hex characters" });
  }

  // find the user
  getUserByIdAnd(_id, (userObject) => {
    if (userObject === null) res.json({ error: "User not found" });
    else {
      const limit = req.query.limit ? req.query.limit : 0;

      // /!\ NOTE `limit` is being applied here BEFORE `from` and `to`
      let promise = ExerciseActivity.find({ user_id: _id }).limit(limit).exec();
      assert.ok(promise instanceof Promise);
      promise.then((exerciseObjects) => {
        // /!\ NOTE `limit` has already been applied at this point, so only
        // the truncated array of exercises will be filtered by `from` and `to`
        if (req.query.from) {
          const from = new Date(req.query.from);
          exerciseObjects = exerciseObjects.filter(
            (e) => new Date(e.date).getTime() >= from.getTime()
          );
        }
        if (req.query.to) {
          const to = new Date(req.query.to);
          exerciseObjects = exerciseObjects.filter(
            (e) => new Date(e.date).getTime() <= to.getTime()
          );
        }
        exerciseObjects = exerciseObjects.map((e) => ({
          ...e,
          date: new Date(e.date).toDateString(),
        }));

        res.json({
          _id: userObject._id,
          username: userObject.username,
          count: exerciseObjects.length,
          log: exerciseObjects,
        });
      });
    }
  });
});
// app.get("/api/users/:_id/logs", async function (req, res) {
  try {
    const { _id } = req.params;
    if (!_id) {
      return res.json({ error: "Invalid Id" });
    }
    const user = await User.findById(_id);
    let exercises = await Exercise.find({userId: user._id})
    // console.log(exercises);

    let { from, to, limit } = req.query;
    let startFrom;
    let endTo;

    if (from && to) {
      startFrom = new Date(from).toISOString();
      endTo = new Date(to).toISOString();
      if (startFrom === "invalid date" || endTo === "invalid date") {
        return res.json({ error: "Invalid Date" });
      }
      if (startFrom > endTo) {
        return res.json({ error: "Invalid Date" });
      }
      console.log(startFrom);
      console.log(endTo);
      
      date = `this.date >= ${startFrom} && this.date <= ${endTo}`;
      // const user = await User.findById(_id);
      exercises = exercises.filter((exercise) => {
        return (
          exercise.date.toISOString() >= startFrom &&
          exercise.date.toISOString() <= endTo
        );
      })
      console.log(exercises);
      if (limit) {
        const setLimit = parseInt(limit);
        if (isNaN(setLimit)) {
          return res.json({ error: "Invalid Limit" });
        }
        exercises = exercises.slice(0, setLimit);
      }
    }
      // get the count
      const count = exercises.length;
      if (count === 0) {
        return res.json({ error: "No Exercises Found" });
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
        count: count,
        log: logs,
      });
   
  } catch (error) {
    console.log(error);
  }
// });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
