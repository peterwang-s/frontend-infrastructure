'use strict'
import mongoose from 'mongoose';

const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  // email: {unique: true, type: String},
  email: {type: String, default: ''},
  signature: {type: String, default: ""}, // 个性签名
  phoneNumber: {type: String, default: ''},
  accessToken: String,
  name: String,
  nickname: String,
  avatar: String,
  areaCode: String,
  verifyCode: String,
  roles: {type: Array, default: ['editor']},
  verified: {type: Boolean, default: false},
  gender: String,
  breed: String,
  age: String,
  meta: {
    createAt: {type: Date, dafault: Date.now()},
    updateAt: {type: Date, dafault: Date.now()}
  }
})

// UserSchema.set('toObject', {getters: true, virtuals: true});
UserSchema.index({username: 1}, {unique: true});

// UserSchema.virtual('avatar_url').get(function () {
//   if(!this.avatar)
//     return config.default_avatar;
//   if(config.qiniu.origin && config.qiniu.origin !== 'http://your qiniu domain')
//     return url.resolve(config.qiniu.origin, this.avatar);
//   return path.join(config.upload.url, this.avatar);
// })

UserSchema.pre('save', function (next) {
  this.meta.updateAt = Date.now()
  next()
})

/**
 * password写入时加密
 */
UserSchema.path('password').set(function (v) {
  return crypto.createHash('md5').update(v).digest('base64');
});


export default UserSchema
