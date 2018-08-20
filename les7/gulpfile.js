var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var minify = require('gulp-minify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');

gulp.task('useref', function () {
    return gulp.src('app/**/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', minify()))
        .pipe(gulpIf('*.css', minifyCSS()))
        .pipe(gulp.dest('dist'))
});