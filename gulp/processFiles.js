/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const gulp = require("gulp");

function processJson() {
	return gulp.src("lib/**/*.json").pipe(gulp.dest("dist"));
}

function processPackageFiles() {
	return gulp
		.src(["package.json", "LICENSE", "README.md"])
		.pipe(gulp.dest("dist"));
}

module.exports = {
	processJson,
	processPackageFiles,
};
