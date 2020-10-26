const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리를 하는 곳
  // Client Cookie 에서 Token을 가져 온다.
  let token = req.cookies.x_auth;

  // 토큰을 복호화 한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({ isAuth: false, error: true})

    req.token = token;
    req.user = user;
    next();
  })  

}

module.exports = { auth };
