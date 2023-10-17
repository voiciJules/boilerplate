const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //trim is to remove blank.
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

const saltRounds = 10;

userSchema.pre("save", function (next) {
  //encrypte your password before saving it to the DB
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hashed) {
        if (err) return next(err);
        user.password = hashed;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  var user = this;
  // plainPassword 12345678, encrypted pw : blahblah
  console.log("user", user);
  console.log("USER comaprePassword function start");
  bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
    console.log("plainPassword in USER comparePassword", plainPassword);
    console.log("user.password in USER comparePassword", user.password);
    console.log("isMatch variable in USER comparePassword", isMatch);
    if (err) {
      return cb(err);
    } else {
      cb(null, isMatch);
    }
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 토큰을 생성하기
  console.log("user._id", user._id);
  console.log("user._id {}", { user });
  console.log("user._id toJSON", user._id.toJSON());
  console.log("user._id toHexString", user._id.toHexString());
  var token = jwt.sign(user._id.toJSON(), "secretToken");
  // 위에 user._id를  {user._id} or user._id.toJSON() or user._id.toHexString()으로 바꾸어보자.
  // 'secretToken'은 아무거나 넣어준거임
  // user._id + 'secretToken' = token
  // 'secretToken' -> 'user._id' 시크릿토큰 글자를 통해 유저 아이디를 알수 있는 것이다
  user.token = token;
  user
    .save()
    .then((result) => {
      console.log(result);
      cb(null, user);
    })
    .catch((err) => {
      console.log(err);
      cb(err);
    });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  console.log("findByToken, user", user);
  //decode token
  jwt.verify(token, "secretToken", async function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 토큰과 데이터베이스에 보관된 토큰이 일치하는지 확인

    // user.findOne({ _id: decoded, token: token }, function (err, user) {
    //   if (err) return cb(err);
    //   cb(null, user);
    // });
    var found = await user.findOne({ _id: decoded, token: token }).exec();
    console.log("found", found);
    cb(null, found);
  });
};

// 아래는 원본코드
// userSchema.statics.findByToken = function (token, cb) {
//   var user = this;

//   //decode token
//   jwt.verify(token, "secretToken", function (err, decoded) {
//     // 유저 아이디를 이용해서 유저를 찾은 다음에
//     // 클라이언트에서 가져온 토큰과 데이터베이스에 보관된 토큰이 일치하는지 확인

//     user.findOne({ _id: decoded, token: token }, function (err, user) {
//       if (err) return cb(err);
//       cb(null, user);
//     });
//   });
// };

// 아래는 수업에 나온 원본 코드

// userSchema.methods.comparePassword = function (plainPassword, cb) {
//   // plainPassword 12345678, encrypted pw : blahblah
//   bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
//     if (err) return cb(err), cb(null, isMatch);
//   });
// };

// userSchema.methods.generateToken = function (cb) {
//   var user = this;
//   //jsonwebtoken을 이용해서 토큰을 생성하기
//   var token = jwt.sign(user._id, "secretToken");
//   // 'secretToken'은 아무거나 넣어준거임
//   // user._id + 'secretToken' = toekn
//   // 'secretToken' -> 'user._id' 시크릿토큰 글자를 통해 유저 아이디를 알수 있는 것이다
//   user.token = token;
//   user.save(function (err, user) {
//     if (err) return cb(err);
//     cb(null, user);
//   });
// };

const User = mongoose.model("User", userSchema);

module.exports = { User };
