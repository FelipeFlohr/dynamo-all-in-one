const { parallel } = require('gulp')
const { processTypescript } = require('./gulp/processScripts')
const { processJson, processPackageFiles } = require('./gulp/processFiles')

module.exports.default = parallel(
  processTypescript,
  processJson,
  processPackageFiles
)
