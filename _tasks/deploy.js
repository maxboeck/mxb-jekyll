'use strict';

import gulp from 'gulp';

gulp.task('deploy', ['build:prod'], () => {
  // add some sort of deployment here, e.g. Github Pages or FTP Push
});