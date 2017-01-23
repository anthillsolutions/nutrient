'use strict';

import dotenv from 'dotenv';
import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();
const SERVER = 'dist/server';
browserSync.create();
dotenv.config({silent: true});

/**
 * Task jshint
 * Use js lint
 */
gulp.task('jshint', ['jscs'], () => {
  return gulp.src([
    'server/**/*.js',
    'gulfile.js',
  ])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'))
    .pipe($.jshint.reporter('fail'));
});

/**
 * Task jscs
 * Use js cs lint
 */
gulp.task('jscs', () => {
  return gulp.src([
    'server/**/*.js',
    'gulfile.js',
  ])
    .pipe($.jscs('.jscsrc'))
    .pipe($.jscs.reporter())
    .pipe($.jscs.reporter('fail'));
});

/**
 * Task reload
 * reload the browser after executing default
 */
gulp.task('reload', ['default'], () => {
  browserSync.reload();
});

/**
 * Task serve
 * launch an express server
 */
gulp.task('serve', () => {
  const server = $.liveServer.new('server/server.js');
  server.start();
});

/**
 * Task clean
 * Remove dist directory
 */
gulp.task('clean', () => {
  return del([
    SERVER,
  ]);
});

/**
 * Task test
 * Build the project and test for it's consistency
 */
gulp.task('test', ['jscs']);
