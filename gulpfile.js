var gulp = require('gulp');
var webpack = require('webpack');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var ftp = require( 'vinyl-ftp' );
var ghPages = require('gulp-gh-pages');
var deploy = require('./deploy.config.json');
var deploy_remote_path = "/public/17zt/viewer"
var webpack_config_demo = require('./webpack.config.example.js');
var babel = require('gulp-babel');
var less = require('gulp-less');
var path = require('path');
// var webpack_config_dist = require('./webpack.config.dist.js');

gulp.task("clean:demo", function(){
  return gulp.src('./demo', {read: false})
    .pipe(clean());
})

//编译示例
gulp.task('build:demo', ['clean:demo'], function(callback) {
  webpack(webpack_config_demo, function (error,status) {
    //gulp 异步任务必须明确执行 callback() 否则 gulp 将一直卡住
    callback()
  });
});

//部署示例到自己的测试服务器
gulp.task('deploy:demo', ['build:demo'], function () {
  deploy.log = gutil.log;

  var conn = ftp.create(deploy);

  return gulp.src('demo/**')
    .pipe(conn.dest(deploy_remote_path))
})

//部署示例到 gh-pages
gulp.task('deploy:gh-pages', ['build:demo'], function() {
  return gulp.src('./demo/**')
    .pipe(ghPages());
});

gulp.task("publish:clean", function(){
  return gulp.src('./dist', {read: false})
    .pipe(clean());
})

//编译 js 文件
gulp.task('publish:js', ["publish:clean"], function(){
  return gulp.src('src/**/*.{js,jsx}')
    .pipe(babel({
        presets: ["es2015", "stage-1", "react"]
    }))
    .pipe(gulp.dest('dist'));
})

//编译 less 文件
gulp.task('publish:less', ["publish:clean"], function () {
  return gulp.src('src/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('dist'));
});

//发布 css 文件
gulp.task('publish:css', ["publish:clean"], function(){
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('dist'))
})

//打包发布 npm
gulp.task('publish', ["publish:clean", 'publish:js', 'publish:css']);

gulp.task('demo', ['deploy:demo']);

gulp.task('gh-pages', ['deploy:gh-pages']);

gulp.task('release', ['publish', 'gh-pages']);