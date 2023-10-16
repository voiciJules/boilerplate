const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");
const cookieParser = require("cookie-parser");

// parsing information from a server
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

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

  // mongoose's save function didn't accept callback anymore. it's error generating code.
  // So, I changed the above code to the below code.
  user.save().then((result) => {
    res
      .status(200)
      .json({
        success: true,
      })
      .catch((err) => {
        // 에러 핸들링 어떻게 해야 하는지 모르겠음.
        // 아래 success: false 가 포스트맨에서 보여지지 않음.
        return res.json({ success: false, err });
      });
  });
});

app.post("/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    console.log("1_req.body.email", req.body.email);
    console.log("2_user", user);
    // 만약 req.body.email 이 데이터베이스에 없다면, 즉 user가 '0'이라면
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 만약 요청된 이메일이 있다면, 패스워드가 맞는지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log("3_isMatch", isMatch);
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      // 비밀번호까지 맞다면 토큰을 생성하기
      console.log("비밀번호까지 맞으면 토큰 생성하기");
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키? 세션? 로컬스토리지? => 여기서는 쿠키에 저장함.
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
