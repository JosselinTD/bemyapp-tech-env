var gulp = require('gulp');
var concat = require('gulp-concat');

var libs = ['node_modules/gojs/release/go.js',
    'client/libs/go-bpmn/jquery.min.js',
    'client/libs/go-bpmn/jquery-ui.min.js',
    'client/libs/go-bpmn/BPMN.js',
    'client/libs/go-bpmn/BPMNClasses.js',
    'client/libs/go-bpmn/DrawCommandHandler.js',
    'node_modules/lodash/lodash.js',
    'node_modules/angular/angular.min.js'];
var libsCss = ['client/libs/go-bpmn/BPMN.css',
    'client/libs/go-bpmn/jquery-ui.css'];

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