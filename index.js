const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
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

app.post("/api/users/register", (req, res) => {
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
  user
    .save()
    .then((result) => {
      res.status(200).json({
        success: true,
      });
      console.log(result);
    })
    .catch((err) => {
      // 에러 핸들링 어떻게 해야 하는지 모르겠음.
      // 아래 success: false 가 포스트맨에서 보여지지 않음.
      // catch 구문을 위에 콘솔 로그 위치에 붙여놓았었음. 잘못된 위치에 놓았었음. 해결됨.
      console.log(err);
      return res.json({ success: false, err });
    });
});

// 1. 요청된 이메일을 데이터베이스에서 찾는다.
// 1-1. 해당되는 이메일이 없다면 res.json으로 로그인 실패 메세지 보낸다.
// 2. 만약 요청된 이메일이 있다면, 패스워드가 맞는지 확인한다.
// 2-1. 비밀번호 틀렸다면 비밀번호가 틀렸다고 메세지 보내기
// 3. 비밀번호까지 다 맞았다면, 토큰을 생성한다.
app.post("/api/users/login", async (req, res) => {
  // 1
  var matchedUser = await User.findOne({ email: req.body.email }).exec();
  console.log(matchedUser);

  // 1-1
  if (!matchedUser) {
    return res.json({
      loginSuccess: false,
      message: "No user for this email address",
    });
  }

  // 2
  matchedUser.comparePassword(req.body.password, (err, isMatch) => {
    console.log("isMatch", isMatch);
    if (!isMatch)
      return res.json({
        loginSuccess: false,
        message: "Password is wrong.",
      });
    // 비밀번호까지 맞다면 토큰을 생성하기
    console.log("비밀번호까지 맞으면 토큰 생성하기");
    matchedUser.generateToken((err, user) => {
      if (err) return res.status(400).send(err);

      // 토큰을 저장한다. 어디에? 쿠키? 세션? 로컬스토리지? => 여기서는 쿠키에 저장함.
      console.log("쿠키에 토큰을 저장");
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    });
  });
});

// app.post("/login", (req, res) => {
//   // 요청된 이메일을 데이터베이스에서 찾는다.
//   User.findOne({ email: req.body.email }, (err, user) => {
//     console.log("1_req.body.email", req.body.email);
//     console.log("2_user", user);
//     // 만약 req.body.email 이 데이터베이스에 없다면, 즉 user가 '0'이라면
//     if (!user) {
//       return res.json({
//         loginSuccess: false,
//         message: "제공된 이메일에 해당하는 유저가 없습니다.",
//       });
//     }

//     // 만약 요청된 이메일이 있다면, 패스워드가 맞는지 확인한다.
//     user.comparePassword(req.body.password, (err, isMatch) => {
//       console.log("3_isMatch", isMatch);
//       if (!isMatch)
//         return res.json({
//           loginSuccess: false,
//           message: "비밀번호가 틀렸습니다.",
//         });
//       // 비밀번호까지 맞다면 토큰을 생성하기
//       console.log("비밀번호까지 맞으면 토큰 생성하기");
//       user.generateToken((err, user) => {
//         if (err) return res.status(400).send(err);

//         // 토큰을 저장한다. 어디에? 쿠키? 세션? 로컬스토리지? => 여기서는 쿠키에 저장함.
//         res
//           .cookie("x_auth", user.token)
//           .status(200)
//           .json({ loginSuccess: true, userId: user._id });
//       });
//     });
//   });
// });

app.get("/api/users/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 것은 isAuth: true 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, async (req, res) => {
  var doc = await User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "" },
    { new: true }
  );

  doc = await User.findOne({ _id: req.user._id });
  console.log(doc);
  if (!doc) {
    return res.json({ success: false });
    console.log("failure ");
  }
  return res.status(200).send({ success: true });
});

// 원본 코드
// app.get("/api/users/logout", auth, (req, res) => {
//   User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
//     if (err) {
//       return res.json({ success: false, err });
//     }
//     return res.status(200).send({ success: true });
//   });
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
