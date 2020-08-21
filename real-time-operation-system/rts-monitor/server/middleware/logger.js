import logging from "@kasa/koa-logging";
import serializers from "@kasa/koa-logging/lib/serializers";
import pino from 'pino';

export default function () {

  function resBodySerializer({status, code, message} = {}) {
    const body = {status, message}
    if (code) {
      body.code = code
    }
    return body
  }

  function resSerializer(ctx = {}) {
    return {
      statusCode: ctx.status,
      duration: ctx.duration,
      type: ctx.type,
      headers: (ctx.response || {}).headers,
      body: resBodySerializer(ctx.body || {})
    }
  }

  return logging({
    logger: pino({
      enabled: true,
      level: 'debug', // 'info'
      serializers: {
        ...serializers,
        res: resSerializer
      }
    })
  })
}
