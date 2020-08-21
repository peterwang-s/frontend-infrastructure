'use strict'
import mongoose from 'mongoose';

const crypto = require('crypto');

const Schema = mongoose.Schema;

const TestSchema = new Schema({
  count: {
    type: Number,
    default: 0
  },
  info: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  updateAt: {
    type: Date,
    default: Date.now()
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  record: [
    {date: {type: Date, dafault: Date.now()}, beizhu: {type: String, default: ''}},
  ]
})

// UserSchema.set('toObject', {getters: true, virtuals: true});
TestSchema.index({count: 1}, {unique: true});

TestSchema.pre('save', function (next) {
  this.updateAt = Date.now()
  next()
})

/**
 * password写入时加密
 */
TestSchema.path('password').set(function (v) {
  return crypto.createHash('md5').update(v).digest('base64');
});


export default TestSchema
