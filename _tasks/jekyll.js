'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import childProcess from 'child_process';
import browserSync from 'browser-sync';

const reload = browserSync.reload;

gulp.task('jekyll', (done) => {
  return childProcess.spawn('jekyll', ['build', /*'--drafts'*/], { stdio: 'inherit' })
    .on('error', error => gutil.log(gutil.colors.red(error.message)))
    .on('close', done);
});

gulp.task('jekyll:reload', ['jekyll'], () => { reload(); });

gulp.task('jekyll:prod', (done) => {
  const productionEnv = process.env;
  productionEnv.JEKYLL_ENV = 'production';

  return childProcess.spawn('jekyll', ['build'], {
    stdio: 'inherit',
    env: productionEnv,
  })
    .on('close', done);
});
