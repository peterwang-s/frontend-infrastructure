#!/usr/bin/env node

// 检测node版本相关依赖
const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, '@vue/cli')

if (semver.satisfies(process.version, '9.x')) {
  console.log(chalk.red(
    `You are using Node ${process.version}.\n` +
    `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
    `It's strongly recommended to use an active LTS version instead.`
  ))
}

// const fs = require('fs')
// const path = require('path')
// const slash = require('slash')
const minimist = require('minimist')

const program = require('commander')


program
  .version(`@aos/huami-sdk-cli ${require('../package').version}`)
  .usage('<command> [options]')


program
  .command('create <app-name>')
  .description('create a new project')
  .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
  .option('-d, --default', 'Skip prompts and use default preset')
  .option('-c, --clone <clone>', 'Use git clone when fetching remote preset')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n ⚠️  检测到您输入了多个名称，将以第一个参数为项目名，舍弃后续参数哦'))
    }
    require('../lib/create')(name, options)
  })

// 创建页面命令
program
  .command('page <page-name>')
  .description('create a new page')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/page')(name, options)
  })

// output help information on unknown commands
program
.arguments('<command>')
.action((cmd) => {
  program.outputHelp()
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  console.log()
})

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

// 自定义错误提示信息
const enhanceErrorMessages = require('../lib/utils/enhanceErrorMessages')
// 缺少参数的错误提示
enhanceErrorMessages('missingArgument', argName => {
  return `缺少必要参数 ${chalk.yellow(`<${argName}>`)}.`
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// 获取参数
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // 如果没有传递option或者有与之相同的命令，则不被拷贝
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}