var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var del = require('del');
var manifest = require('asset-builder')('manifest.json');

var kartographDeps = manifest.getDependencyByName('kartograph.js');


gulp.task('clean', function () {
  return del([
    manifest.paths.dist
  ]);
});

gulp.task('coffee', ['clean'], function() {

    gutil.log(JSON.stringify(manifest, null, 2));

    gulp.src(kartographDeps.globs)
        .pipe(concat('kartograph.coffee'))
        .pipe(coffee({

        }).on('error', gutil.log))
        .pipe(gulp.dest(manifest.paths.dist+'/kartograph.js'));

});


