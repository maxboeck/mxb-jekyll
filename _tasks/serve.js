'use strict';

import gulp from 'gulp';

gulp.task('serve', ['browsersync'], () => {
  //asset pipeline
  gulp.watch(['_assets/sass/**/*.scss'], ['sass']);
  gulp.watch(['_assets/js/**/*.js'], ['scripts']);
  gulp.watch(['_assets/images/**/*'], ['imagemin']);
  gulp.watch(['_assets/icons/**/*.svg'], ['icons']);

  //jekyll
  gulp.watch(['*.html', '_layouts/**/*', '_includes/**/*', '_posts/**/*', '_projects/**/*'], ['jekyll:reload']);
});

gulp.task('default', ['serve']);