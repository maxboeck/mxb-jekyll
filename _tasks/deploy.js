'use strict'

import gulp from 'gulp'
import gutil from 'gulp-util'
import ftp from 'vinyl-ftp'
import config from '../ftpconfig'

gulp.task('deploy', ['build:prod'], () => {
    const remoteDir = '/html'
    const src = ['_site/**']
    const conn = ftp.create({
        host: config.host,
        user: config.user,
        password: config.password,
        parallel: 10,
        log: gutil.log
    })

    return gulp
        .src(src, { base: '.', buffer: false })
        .pipe(conn.newer(remoteDir))
        .pipe(conn.dest(remoteDir))
})
