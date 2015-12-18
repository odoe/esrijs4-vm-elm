var gulp = require('gulp');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var spawn = require('child_process').spawn;

gulp.task('js', function () {
  return gulp.src([
    'src/app/*.js', 'src/app/**/*.js'
  ])
  .pipe(babel({
    sourceMaps: 'inline',
    presets: ['es2015'],
    plugins: ['transform-es2015-modules-amd']
  }))
  .pipe(gulp.dest('dist/app'));
});

gulp.task('elm', function() {
  // Finally execute your script below - here "ls -lA"
  var child = spawn("elm-make", [
    "src/app/Search.elm",
    "--output=dist/app/Search.js"
    ], {cwd: process.cwd()}),
      stdout = '',
      stderr = '';

  child.stdout.setEncoding('utf8');

  child.stdout.on('data', function (data) {
      stdout += data;
      gutil.log(data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function (data) {
      stderr += data;
      gutil.log(gutil.colors.red(data));
      gutil.beep();
  });

  child.on('close', function(code) {
      gutil.log("Elm files compiled");
  });
});

gulp.task('sass', function () {
  gulp.src('src/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('copy', function() {
  return gulp.src([
    'src/dojoConfig.js',
    'src/index.html'
    ])
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
  gulp.watch([
    'src/app/*.elm'
  ], ['elm']);
  gulp.watch([
    'src/styles/*.scss'
  ], ['sass']);
  gulp.watch([
    'src/*.js', 'src/**/*.js', 'src/**/**/*.js'
  ], ['js']);
  gulp.watch([
    'src/dojoConfig.js', 'src/index.html'
  ], ['copy']);
});

gulp.task('default', ['js', 'elm', 'sass', 'copy']);
