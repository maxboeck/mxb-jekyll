'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const config  = {
  removeComments: true,
  collapseWhitespace: true
};

gulp.task('htmlmin', () => {
  return gulp.src('./_site/**/*.html')
    .pipe($.htmlmin(config))
    .pipe(gulp.dest('./_site/'))
    .pipe(reload({stream: true}));
});