'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import critical from 'critical';

const config = {
  inline: true,
  base: '_site',
  minify: true,
  width: 1280,
  height: 800,
  ignore: ['@font-face'],
};

gulp.task('critical', () => {
  return gulp.src('_site/index.html')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.log(gutil.colors.red(err));
        this.emit('end');
      },
    }))
    .pipe(critical.stream(config))
    .pipe(gulp.dest('_site'));
});
