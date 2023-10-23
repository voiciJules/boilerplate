const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리를 하는 곳

  // 쿠키파서 이용하여 클라이언트 쿠키에서 토큰을 가져온다.
  let token = req.cookies.x_auth;

  // 토큰을 복호화하여 유저 정보를 얻는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user; // index.js 에서 req.token, req.user 정보를 사용할 수 있도록 하는 것.
    console.log("auth, req.token", req.token);
    console.log("auth.js req.user", req.user);
    next(); // 미들웨어에 갇히지 않고 다음 단계로 넘어갈 수 있도록 해주는 함수.
  });

  // 유저가 있으면 인증 OK!

  // 유저가 없으면 인증 NO!
};

module.exports = { auth };
