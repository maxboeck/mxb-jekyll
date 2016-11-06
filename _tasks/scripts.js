'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack-stream';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('scripts', () => {
  return gulp.src('_assets/js/main.js')
    .pipe(webpack({
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel',
          exclude: '/node_modules/',
          query: { compact: false }
        }]
      }
    }))
    .pipe($.rename('bundle.js'))
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(reload({stream: true}))
    .pipe($.uglify({onError: browserSync.notify}))
    .pipe($.rename({extname: '.min.js'}))
    .pipe(gulp.dest('_site/assets/js'));
});