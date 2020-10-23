const express = require('express')
const app = express()
const port = 5000

// MongoDB Keys
const config = require('./config/key');

// body-parser를 가져온다
const bodyParser = require('body-parser');
// cookie-parser 를 가져온다.
const cookieParser = require('cookie-parser');
// User schema를 가져온다
const { User } = require("./models/User");

// application/x-www-form-urlencoded 분석해서 가져온다
app.use(bodyParser.urlencoded({extended: true}));
// application/json 분석해서 가져온다
app.use(bodyParser.json());
// cookieParser 사용
app.use(cookieParser());


// nodejs Server
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// GET 방식으로 루트폴더(/) 로 이동
app.get('/', (req, res) => {
  res.send('Hello World!!! 안녕하세요~ 테스트 입니다.!!!!!!!!!!!!!!!!!!!!!')
})


// 회원가입 ::: POST 방식으로 (/register) 폴더로 이동 : 회원가입을 위한 Router
app.post('/register', (req, res) => {
  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.

  const user = new User(req.body)


  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})  // err일 경우 json식으로 에러 보여줌

    // 성공일 경우
    return res.status(200).json({
      success: true
    })

  })
})

// 로그인 :::
app.post('/api/users/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "일치하는 이메일이 없습니다."
      })
    }

    // 요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인.
    user.comparePassword( req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      // 비밀번호가 맞다면 Token을 생성하기.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // Token을 저장한다. (쿠키, 로컬스토리지 등등에 저장할 수 있음.)
        // 쿠키에 저장 :: 라이브러리 설치해야 함 :: npm install cookie-parser --save
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})

      })

    })
  })



})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})