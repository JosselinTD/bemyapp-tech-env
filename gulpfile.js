var gulp = require('gulp');
var concat = require('gulp-concat');

var libs = ['node_modules/gojs/release/go.js',
    'node_modules/lodash/lodash.js',
    'node_modules/angular/angular.min.js'];
var libsCss = [];

gulp.task('default', function() {
    gulp.src(libs)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./client/js'));
    gulp.src(['./client/app/**/*.module.js', './client/app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./client/js'));
        
    gulp.src(libsCss)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./client/css'));
    gulp.src(['./client/app/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./client/css'));
});