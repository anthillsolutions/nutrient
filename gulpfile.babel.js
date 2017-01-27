'use strict';

import dotenv from 'dotenv';
import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();
const SERVER = 'dist/server';
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

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
  let server;
  if (ENV === 'production') {
    server = $.liveServer(SERVER + '/bin/www', undefined, false);
    server.start();
  } else {
    server = $.liveServer(SERVER + '/bin/www');
    server.start();
  }
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
 * Task pre-test
 * Runs istanbul to get all files to cover
 */
gulp.task('pre-test', () => {
  return gulp.src([
    'server/**/*.js',
    '!server/tests/**/*.js',
  ])
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire());
});

/**
 * Task test
 * Build the project and test for it's consistency
 */
gulp.task('test', ['jscs', 'pre-test'], () => {
  return gulp.src('server/tests/**/*.js')
    .pipe($.mocha())
    .pipe($.istanbul.writeReports())
    .pipe($.istanbul.enforceThresholds({
      thresholds: { global: 70 }
    }));
});

/**
 * Task coverage
 * Sends coverage tests to coveralls
 */
gulp.task('coverage', ['test'], () => {
  if (process.env.NODE_ENV === 'test-ci') {
    return gulp.src('coverage/**/lcov.info')
      .pipe($.coveralls());
  }
});

/**
 * Task build
 * Build the project
 */
gulp.task('build', ['clean'], () => {
  return gulp.src([
    'server/**/*'
  ])
    .pipe(gulp.dest(SERVER));
});
