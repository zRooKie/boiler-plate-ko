const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlenght: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlenght: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {  
    // 유효성
    type: String
  },
  tokenExp: {
    // token 유효기간
    type: Number
  }
})


// 회원가입 :: 저장 전에 비밀번호 암호화
userSchema.pre('save', function(next){

  var user = this;
  if(user.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

// 로그인 :: 비밀번호가 맞는지 확인
userSchema.methods.comparePassword = function(plainPassword, cb) {
  // plainPassword 1234567, 암호화된 비밀번호 $2b$10$yqYHD9S6EieeAQug6vBUqOam.AS3d0mveGougezgQUPAlGRU2I9P.
  // plainPassword 를 암호화해서 비교
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  })
}

// 로그인 :: 토큰 생성
userSchema.methods.generateToken = function(cb) {

  var user = this;

  // jsonwebtoken을 이용해서 Token 생성
  // _id :: MongoDB의 _id
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  user.token = token
  user.save(function(err, user) {
    if(err) return cb(err)
    cb(null, user)
  })
  
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
