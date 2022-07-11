const gulp = require('gulp')
const ts = require('gulp-typescript').createProject('tsconfig.json')

function processTypescript () {
  return gulp.src('lib/**/*.ts')
    .pipe(ts())
    .pipe(gulp.dest('dist'))
}

module.exports = {
  processTypescript
}
