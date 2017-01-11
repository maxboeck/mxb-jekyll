'use strict';

import gulp from 'gulp';

gulp.task('serve', ['browsersync'], () => {
  
  //asset pipeline
  gulp.watch(['_assets/styles/**/*.scss', '_projects/**/*.scss'], ['sass']);
  gulp.watch(['_assets/js/**/*.js'], ['scripts']);
  gulp.watch(['_assets/images/**/*'], ['imagemin']);
  gulp.watch(['_assets/icons/**/*.svg'], ['icons']);

  //jekyll
  gulp.watch([
    '*.html', 
    '_layouts/**/*.{html,md}', 
    '_includes/**/*.{html,md}',
    '_drafts/**/*.{html,md}', 
    '_posts/**/*.{html,md}', 
    '_pages/**/*.{html,md}',
    '_projects/**/*.{html,md}'
  ], ['jekyll:reload']);
});

gulp.task('default', ['serve']);