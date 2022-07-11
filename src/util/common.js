const fs = require('fs-extra')
const { resolve } = require('path')

function getPackageInfo () {
  return fs.readJsonSync(resolve(process.cwd(), 'package.json'))
}

module.exports = {
  getPackageInfo
}
