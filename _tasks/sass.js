'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const AUTOPREFIXER_BROWSERS = [
  '> 1%', 
  'last 3 versions', 
  'Firefox ESR', 
  'Opera 12.1', 
  'Explorer 8'
];

gulp.task('sass', () => {
  return gulp.src('_assets/styles/main.scss')
    .pipe(plumber({
      handleError: function (err) {
        gutil.log(gutil.colors.red(err));
        this.emit('end');
      }
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      onError: browserSync.notify
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write())
    .pipe($.rename({extname: '.css'}))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(reload({stream: true}))
    .pipe($.cleanCss({keepBreaks: false, keepSpecialComments:true}))
    .pipe($.rename({extname: '.min.css'}))
    .pipe(gulp.dest('_site/assets/css'));
});