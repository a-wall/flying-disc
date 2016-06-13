var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var fileinclude = require('gulp-file-include');
var notify = require('gulp-notify');
var growl = require('gulp-notify-growl');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var htmllint = require('gulp-htmllint');
var gutil = require('gulp-util');

function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(function (issue) {
      gutil.log(gutil.colors.cyan('[gulp-htmllint] ') + gutil.colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + gutil.colors.red('(' + issue.code + ') ' + issue.msg));
    });
  }
}

// HTML tasks

gulp.task('compose-html', function() {
  gulp.src(['source/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: 'source/partials/'
    }))
    .pipe(htmllint({}, htmllintReporter))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Javascript tasks

gulp.task('jscs', function() {
  gulp.src('source/js/**/*.js')
    .pipe(jscs())
    .pipe(notify({
      title: 'JSCS',
      message: 'JSCS Passed. Let it fly!',
      notifier: growl
    }))
});

gulp.task('lint', function () {
  return gulp.src('source/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('validate', ['jscs', 'lint']);

gulp.task('js', function() {
  return gulp.src('source/js/**/*.js')
  .pipe(gulp.dest('public/js'))
  .pipe(browserSync.reload({
    stream: true
  }))
})

gulp.task('build-js', function() {
  return gulp.src(['source/js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('public/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'));
});

// CSS tasks

gulp.task('sass', function(){
  return gulp.src('source/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('build-css', function(){
  return gulp.src('source/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('public/css'))
});

gulp.task('fonts', function() {
  return gulp.src('source/fonts/**/*')
  .pipe(gulp.dest('public/css/mysource_files'))
})

// build

gulp.task('build', ['build-css', 'build-js', 'compose-html']);


gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('source/scss/**/*.scss', ['sass']); 
  gulp.watch('source/**/*.html', ['compose-html']); 
  gulp.watch('source/js/**/*.js', ['js', 'validate']); 
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'public'
    },
  })
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})