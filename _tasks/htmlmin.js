'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('htmlmin', () => {
  return gulp.src('./_site/**/*.html')
    .pipe($.htmlmin( {collapseWhitespace: true}))
    .pipe(gulp.dest('./_site/'))
    .pipe(reload({stream: true}));
});