'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';

gulp.task('browser-sync', ['build'], () => {
  browserSync({
    notify: {
      styles: [
        'font-family: sans-serif',
        'font-weight: bold;',
        'padding: 10px;',
        'margin: 0;',
        'position: fixed;',
        'font-size: 0.6em;',
        'line-height: 0.8em;',
        'z-index: 9999;',
        'left: 5px;',
        'top: 5px;',
        'color: #fff;',
        'border-radius: 2px',
        'background-color: #333;',
        'background-color: rgba(50,50,50,0.8);'
      ]
    },
    server: {
      baseDir: '_site'
    }
  });
});