'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';

gulp.task('browsersync', ['build'], () => {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});