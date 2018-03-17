const gulp = require('gulp');
const webpack = require('webpack');
const clean = require('gulp-clean');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');
const ghPages = require('gulp-gh-pages-will');
const deploy = require('./deploy.config.json');

const deploy_remote_path = '/public/17zt/viewer';
const webpack_config_demo = require('./webpack.config.example.js');
const babel = require('gulp-babel');
const less = require('gulp-less');
const path = require('path');
// var webpack_config_dist = require('./webpack.config.dist.js');

gulp.task('clean:demo', () => {
  return gulp.src('./demo', { read: false })
    .pipe(clean());
});

// 编译示例
gulp.task('build:demo', ['clean:demo'], (callback) => {
  webpack(webpack_config_demo, () => {
    // gulp 异步任务必须明确执行 callback() 否则 gulp 将一直卡住
    callback();
  });
});

// 部署示例到自己的测试服务器
gulp.task('deploy:demo', ['build:demo'], () => {
  deploy.log = gutil.log;

  const conn = ftp.create(deploy);

  return gulp.src('demo/**')
    .pipe(conn.dest(deploy_remote_path));
});

// 部署示例到 gh-pages
gulp.task('deploy:gh-pages', ['build:demo'], () => {
  return gulp.src('./demo/**')
    .pipe(ghPages());
});

gulp.task('publish:clean', () => {
  return gulp.src('./dist', { read: false })
    .pipe(clean());
});

// 编译 js 文件
gulp.task('publish:js', ['publish:clean'], () => {
  return gulp.src('src/**/*.{js,jsx}')
    .pipe(babel({
      presets: ['es2015', 'stage-1', 'react'],
    }))
    .pipe(gulp.dest('dist'));
});

// 编译 less 文件
gulp.task('publish:less', ['publish:clean'], () => {
  return gulp.src('src/**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')],
    }))
    .pipe(gulp.dest('dist'));
});

// 发布 css 文件
gulp.task('publish:css', ['publish:clean'], () => {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('dist'));
});

// 打包发布 npm
gulp.task('publish', ['publish:clean', 'publish:js', 'publish:css']);

gulp.task('demo', ['deploy:demo']);

gulp.task('gh-pages', ['deploy:gh-pages']);

gulp.task('release', ['publish', 'gh-pages']);
