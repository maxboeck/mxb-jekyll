'use strict'

import gulp from 'gulp'
import gutil from 'gulp-util'
import childProcess from 'child_process'
import browserSync from 'browser-sync'

const reload = browserSync.reload

gulp.task('jekyll', done => {
    const devEnv = process.env
    devEnv.JEKYLL_ENV = 'development'

    return childProcess
        .spawn('jekyll', ['build', '--incremental', '--drafts'], {
            stdio: 'inherit',
            env: devEnv
        })
        .on('error', error => gutil.log(gutil.colors.red(error.message)))
        .on('close', done)
})

gulp.task('jekyll:reload', ['jekyll'], () => {
    reload()
})

gulp.task('jekyll:prod', done => {
    const productionEnv = process.env
    productionEnv.JEKYLL_ENV = 'production'

    return childProcess
        .spawn('jekyll', ['build'], {
            stdio: 'inherit',
            env: productionEnv
        })
        .on('close', done)
})
