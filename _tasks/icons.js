'use strict';

import gulp from 'gulp';
import glob from 'glob';
import gutil from 'gulp-util';
import Grunticon from 'grunticon-lib';

/* Gulpicon Configuration */
let config  = {

  // CSS filenames
  datasvgcss: 'icons.data.svg.css',
  datapngcss: 'icons.data.png.css',
  urlpngcss: 'icons.fallback.css',

  // preview HTML filename
  previewhtml: 'preview.html',

  // grunticon loader code snippet filename
  loadersnippet: 'grunticon.loader.js',

  // Include loader code for SVG markup embedding
  enhanceSVG: true,

  // Make markup embedding work across domains (if CSS hosted externally)
  corsEmbed: false,

  // folder name (within dest) for png output
  pngfolder: 'png',

  // prefix for CSS classnames
  cssprefix: '.icon--',

  defaultWidth: '24px',
  defaultHeight: '24px',

  // css file path prefix
  // this defaults to '/' and will be placed before the 'dest' path
  // when stylesheets are loaded. It allows root-relative referencing
  // of the CSS. If you don't want a prefix path, set to to '
  cssbasepath: '',
  compressPNG: true
};

/* Gulpicon Module */

const gulpicon = function( files, config, dest ) {

  return function(callback) {

    // get the config
    config.logger = {
      verbose: function() {} || config.verbose,
      fatal: function() {},
      ok: function() {}
    };

    files = files.filter( function( file ){
      return file.match( /png|svg/ );
    });

    if( files.length === 0 ){
      gutil.log( 'Grunticon has no files to read!' );
      callback( false );
      return;
    }

    if( !dest || dest && dest === '' ){
      gutil.log('The destination must be a directory');
      callback( false );
    }

    var gicon = new Grunticon(files, dest, config);

    gicon.process( callback );
  };
};


const files = glob.sync('_assets/icons/**/*.svg');
gulp.task('icons', 
  gulpicon(files, config, '_site/assets/icons')
);
