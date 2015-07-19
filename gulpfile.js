'use strict';

var gulp = require('gulp'),
    react = require('gulp-react'),
    plumber = require('gulp-plumber'),
    del = require('del');

// Not all tasks need to use streams
gulp.task('clean', function (callback) {
    var paths = [
        'build/*'
    ];

    del(paths, callback);
});

gulp.task('build-scripts', function () {
    return gulp.src('src/**/*.*')
        .pipe(react({harmony: true}))
        .pipe(gulp.dest('build'));
});

// Default watch task
gulp.task('watch', ['build-scripts'], function () {
    gulp.watch(['src/**/*'], ['build-scripts']);
});

// Default build task
gulp.task('default', ['build-scripts']);
