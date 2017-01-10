'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import swPrecache from 'sw-precache';
import path from 'path';

function writeServiceWorkerFile(rootDir, handleFetch, callback) {
  var config = {
    cacheId: 'mxb',
    handleFetch: handleFetch,
    logger: gutil.log,
    staticFileGlobs: [
      rootDir + '/index.html',
      rootDir + '/blog/index.html',
      rootDir + '/about/index.html',
      rootDir + '/contact/index.html',

      rootDir + '/assets/css/main.*',
      rootDir + '/assets/fonts/*',
      rootDir + '/assets/icons/*',
      rootDir + '/assets/js/bundle.*',
      rootDir + '/assets/images/content/*'
    ],
    stripPrefix: rootDir + '/',
    verbose: true
  };
  
  swPrecache.write(path.join(rootDir, 'sw.js'), config, callback);
}

gulp.task('precache', (cb) => {
  writeServiceWorkerFile('_site', false, cb);
});

gulp.task('precache:prod', (cb) => {
  writeServiceWorkerFile('_site', true, cb);
});