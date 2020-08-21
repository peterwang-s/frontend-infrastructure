import log4js from "log4js";
import convert from "koa-convert";
import logger from "koa-logger";

export default function(){

  log4js.configure({
    // appenders: [
    //     { type: 'console' },
    //     { type: 'dateFile', filename: __dirname + '/../tmp/boilerplate.log' , "pattern":"-yyyy-MM-dd-hh.log","alwaysIncludePattern":false, category: 'file' }
    // ],
    appenders: {cheese: {type: 'file', filename: 'cheese.log'}},
    categories: {default: {appenders: ['cheese'], level: 'error'}},
    replaceConsole: true
  });

  return convert(logger())
}
