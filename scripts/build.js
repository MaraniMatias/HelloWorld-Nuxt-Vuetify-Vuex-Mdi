#!/usr/bin/env node
/* eslint no-console: 0 */

// Using
// ./build.js ./config/demo
// ./build.js ./config/demo --deploy

'use strict'
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const Colors = require('./Colors')

process.title = 'Rapicopia build'
const CONFIG_PATH = path.normalize(process.argv[2].replace(/config.env$/, ''))
const ROOT_PATH = process.cwd()
// const doDeploy = /--deploy/.test(process.argv[3]);

// Files to copy
// const assetsPath = '/assets'
const publicPath = '/static'
const filesToCopy = [
  { file: 'assets/logo.png', toPath: publicPath },
  { file: 'assets/logo_bg.png', toPath: publicPath },
  { file: 'favicon.ico', toPath: publicPath },
]
function makePath(...arg) {
  return path.normalize(path.join(...arg))
}

// Files to copy
const copyFile = (filesToCopy) =>
  Promise.all([
    new Promise(function (resolve, reject) {
      const clientENV = makePath(CONFIG_PATH, '/config.env')
      const productionENV = makePath(ROOT_PATH, '.env.production')
      fs.readFile(clientENV, 'utf8', (err, data) => {
        if (err) reject(err)
        fs.writeFile(productionENV, data, 'utf8', (err) => {
          if (err) reject(err)
          else {
            const client = CONFIG_PATH.replace(/(config|\/)/gi, '')
            console.log(
              `${Colors.FgYellow}➤ ${Colors.Reset}The config %s is been copied!`,
              `${Colors.FgCyan}${client}${Colors.Reset}`
            )
            resolve()
          }
        })
      })
    }),
    new Promise(function (resolve, reject) {
      filesToCopy.forEach(({ file, toPath }) => {
        fs.copyFile(
          makePath(ROOT_PATH, CONFIG_PATH, file),
          makePath(ROOT_PATH, toPath, file),
          (err) => {
            if (err) reject(err)
            else {
              console.log(
                `${Colors.FgGreen}✔ ${Colors.Reset}Copied: ` +
                  `${Colors.FgBlue}/${file}${Colors.Reset} to ${Colors.FgYellow}${toPath}${Colors.Reset}`
              )
              resolve()
            }
          }
        )
      })
    }),
  ])

// Read another files and put on assets path
const copyAssetsClientFolder = () =>
  new Promise(function (resolve, reject) {
    const assetsClient = makePath(CONFIG_PATH, '/assets_custom')
    const assetsClientOnPublic = makePath(
      ROOT_PATH,
      publicPath,
      '/assets_custom'
    )
    if (fs.existsSync(assetsClientOnPublic)) {
      fs.readdirSync(assetsClientOnPublic).forEach((file) => {
        fs.unlinkSync(makePath(assetsClientOnPublic, file))
      })
    } else {
      fs.mkdirSync(assetsClientOnPublic)
    }
    if (fs.existsSync(assetsClient)) {
      try {
        fs.readdirSync(assetsClient).forEach((file) => {
          fs.copyFileSync(
            makePath(ROOT_PATH, CONFIG_PATH, 'assets_custom', file),
            makePath(ROOT_PATH, publicPath, 'assets_custom', file)
          )
          console.log(
            `${Colors.FgGreen}✔ ${Colors.Reset} Copied: ` +
              `${Colors.FgBlue}/${file}${Colors.Reset} to ${publicPath}/assets`
          )
        })
        resolve()
      } catch (err) {
        reject(err)
      }
    } else {
      resolve()
    }
  })

const build = () =>
  new Promise(function (resolve, reject) {
    spawn('npm', ['run', 'generate'], { shell: true, stdio: 'inherit' }).on(
      'close',
      (code) => {
        if (code === 0) resolve()
        else reject(new Error('Algo salio mal'))
      }
    )
  })

function faill(error = 'Exit.') {
  console.error(error)
  process.exit(1)
}

copyFile(filesToCopy)
  .catch(faill)
  .then(() => {
    copyAssetsClientFolder()
      .catch(faill)
      .then(() => {
        build()
          .catch(faill)
          .then(() => {
            const client = CONFIG_PATH.replace(/(config|\/)/gi, '')
            console.log(
              `Finish build for ${Colors.FgCyan}${client}${Colors.Reset}`
            )
            process.exit(0)
          })
      })
  })
