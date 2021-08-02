/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-empty */
const gulp = require("gulp");
const fs = require("fs-extra");

gulp.task("git_keep", async () => {
  fs.removeSync('.git');
  fs.copySync('.git.keep', '.git');
});

gulp.task("git_open", async () => {
  fs.removeSync('.git');
  fs.copySync('.git.open', '.git');
});