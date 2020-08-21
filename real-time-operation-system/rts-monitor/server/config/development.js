export default function () {
  return {
    mongodb: {
      url: 'mongodb://localhost:27017/watchtower_monitor_dev',
      // url: 'mongodb://178.128.218.86:27017/watchtower_monitor_test',
      // url: 'mongodb://178.128.218.86:27017/watchtower_monitor_prd',
    },
    mongodbOptions: {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectInterval: 5000,
      reconnectTries: Number.MAX_VALUE,
      useCreateIndex: true,
      poolSize: 3,
      useUnifiedTopology: true
    },
  }
}
