'use strict';

import gulp from 'gulp';

gulp.task('copy', () => {
  return gulp.src([
    '_assets/js/*.js',
    '!_assets/js/main.js',
    '_assets/fonts/**'
  ], {
    base: '_assets'
  })
  .pipe(gulp.dest('_site/assets/'));
});