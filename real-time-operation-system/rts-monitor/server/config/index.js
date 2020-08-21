"use strict";
const path = require("path");
import development from './development'
import production from './production'
import test from './test'

let env = {
  development,
  test,
  production,
}

let config = {
  app: {
    root: path.normalize(path.join(__dirname, "/..")),
    env: process.env.NODE_ENV,
    port: 5008,
    name: "watchtower-monitor",
    excluded: "excluded_path",
    default_avatar:''
  },
  jwt: {
    secret: 'watchtower-monitor', // 默认
  },
};
config = (function (config,env,NODE_ENV) {
  return {...config, ...env[NODE_ENV || "development"]()}
}(config,env,process.env.NODE_ENV));

export default config
