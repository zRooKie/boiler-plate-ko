const express = require('express')
const app = express()
const port = 5000


// body-parser를 가져온다
const bodyParser = require('body-parser');
// User schema를 가져온다
const { User } = require("./models/User");

// application/x-www-form-urlencoded 분석해서 가져온다
app.use(bodyParser.urlencoded({extended: true}));
// application/json 분석해서 가져온다
app.use(bodyParser.json());


// nodejs Server
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://zrookie:hamer5878@boilerplate.5943o.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// GET 방식으로 루트폴더(/) 로 이동
app.get('/', (req, res) => {
  res.send('Hello World!!! 안녕하세요~ 테스트 입니다.!!!!!!!!!!!!!!!!!!!!!')
})


// POST 방식으로 회원가입 (/register) 폴더로 이동 : 회원가입을 위한 Router
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})