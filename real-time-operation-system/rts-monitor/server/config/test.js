export default function () {
  return {
    mongodb: {
      url: 'mongodb://hostname:port/watchtower_monitor_prod',
    },
    mongodbOptions: { // mongodb用户和密码
      user: 'wang',
      pass: 'damowang',
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectInterval: 5000,
      reconnectTries: Number.MAX_VALUE,
      useCreateIndex: true,
      poolSize: 3
    },
  }
}
