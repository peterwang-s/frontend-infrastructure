# solution-monitor
[![Node](https://img.shields.io/badge/node-8.9.0~10.15.1-green.svg?style=plastic)](https://nodejs.org/en/)
[![Vue](https://img.shields.io/badge/vue-2.0+-blue.svg?style=plastic)](https://cn.vuejs.org/)
[![Koa](https://img.shields.io/badge/koa-2.0%2B-green)](https://koa.bootcss.com/)
[![Mongodb](https://img.shields.io/badge/mogodb-4.0+-brightgreen.svg?style=plastic)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/redis-5.0+-green.svg?style=plastic)](https://redis.io/)

简体中文 | [English](./README.md) | [日本語](./README.ja.md)


## 简介

实现轻量可以灵活扩展的，高性能、支持分布式集群部署、高可用的前端性能监控系统和分析平台。

## 主要功能
1. 网站pv、uv、ip访问 统计分析
2. web sdk
3. 网站性能数据统计分析
4. 网站错误信息捕获和统计分析
5. 页面无埋点打点技术
6. ip来源分析技术
7. 国家统计分析
8. 用户行为漏斗分析
9. 微信小程序 sdk
10. 可视化数据分析（国家流量热力图、ip地址热力图、流量趋势表）
11. 每日日报发送
12. 报警风控系统
13. 用户实时访问流量统计功能

## 核心模块

1. 多级缓存（文件缓存+redis 缓存 + mongodb 缓存）
2. 日志分析子模块
3. webpage 上报数据隧道
4. ip 地址库
5. 国家码 数据库
6. 邮件服务
7. 微信通知
8.

## 核心架构

1. 分布式集群部署（eage 集群，redis 集群， mongodb 集群，集群分片）
2. 缓存策略
3. 数据库写扩散和读扩散
4. redis 消息队列
5. mongodb 读写主从分离
6. 数据库分表

## 开发 Getting started
```
# clone the project
git clone **.git

# enter the project directory
cd **

# install dependency
npm install

# develop
npm run dev

```


## 打包 Build
```
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod

```
## Changelog


## 压测规则

## 项目自动化测试报告

## 捐赠

支付宝 987060149@qq.com 微信iambestboy






