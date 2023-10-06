const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");

// parsing information from a server
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  // when we receive information of sign-up, it put them into DB.
  const user = new User(req.body);
  //   user.save((err, userInfo) => {
  //     if (err) return res.json({ success: false, err });
  //     return res.status(200).json({
  //       success: true,
  //     });
  //   });
  // mongoose's save function didn't accept callback anymore. it's error code
  user.save().then((result) => {
    console.log(result);
    res.send(user);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
