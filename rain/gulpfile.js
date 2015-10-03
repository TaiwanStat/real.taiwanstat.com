var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");

gulp.task('scripts', function() {
    //single entry point to browserify
    gulp.src(['js/**/**.js'])
        .pipe(browserify({
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-css', function() {
  return gulp.src('./css/*.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('watch', function () {
  gulp.watch('./js/*js', ['scripts']);
  gulp.watch('./css/*css', ['minify-css']);
});

gulp.task('default', ['scripts',  'minify-css', 'watch']);
