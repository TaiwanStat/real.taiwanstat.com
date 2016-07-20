"use strict";
var gulp = require('gulp');
var css = require('gulp-mini-css');
var js = require('gulp-uglify');
var babel = require('gulp-babel');
var connect = require('gulp-connect');

var dest = __dirname + '/dist';
var src = __dirname + '/src';

gulp.task('css', function() {
    gulp.src(src + '/css/*.css')
        .pipe(css({ext:'.min.css'}))
        .pipe(gulp.dest(dest + '/css'))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src(src + '/js/index.js')
        .pipe(babel({
			presets: ['es2015']
		}))
        .pipe(js())
        .pipe(gulp.dest(dest + '/js'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src(__dirname + '/*.html')
      .pipe(connect.reload());
});

gulp.task('watch', function () {
	// Endless stream mode
    gulp.watch(src + '/css/*.css', ['css']);
    gulp.watch(src + '/js/index.js', ['js']);
    gulp.watch(__dirname + '/*.html', ['html']);
});

gulp.task('webserver', function(){
    connect.server({
        livereload: true,
    });
});



gulp.task('default', ['webserver','js','css','watch']);
