import mongoose from 'mongoose'
import config from '../config'
import TestSchema from '../schemas/test'

mongoose.Promise = Promise;
mongoose.connect(config.mongodb.url, config.mongodbOptions).catch((error)=>{
  console.error(error)
});
// mongoose.connection.on('error', console.error);
const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
db.on('error', console.error);
db.on('open', function () {
  // todo  监控
  console.log('db success');
});
db.on('connecting', function () {
  console.log('db connecting')
})
db.on('reconnected', function () {
  console.log('db reconnected')
})
db.on('connected', function () {
  console.log('db connected',config.mongodb)
})
db.on('disconnecting', function () {
  console.log('db disconnecting')
})
db.on('reconnectFailed', function () {
  console.log('db reconnectFailed')
})
db.on('disconnected', function () {
  console.log('db disconnected')
})
db.on('close', function () {
  console.log('db close')
})

mongoose.model("test", TestSchema)

export default function dbKeeper() {

  return async (ctx, next) => {
    ctx.db = db

    ctx.models = function (name) {
      name = name.toLowerCase();
      return mongoose.model(name);
    }
    await next()
  }
}

export function getModels(name) {
  name = name.toLowerCase();
  return mongoose.model(name);
}
