// function defaultTask(cb) {
//     // place code for your default task here
//     console.log('haha')
//     cb();
//   }
  
//   exports.default = defaultTask

// 公开任务：被导出
// 私有任务：没被导出

// const {series,parallel} = require('gulp');
// // console.log(gulp);
// function fn1(cb){
//     console.log('fn1被调用了');
//     cb(); //用来告诉结束
// }
// function fn2(cb){
//     console.log('fn2被调用了');
//     cb(); //用来告诉结束
// }
// exports.build = fn1;
// exports.default = series(fn1,fn2);

// function js(cb){
//     console.log('js被调用了');
// }
// function css(cb){
//     console.log('css被调用了');
// }
// function html(cb){
//     console.log('html被调用了');
// }
// exports.default = series(html,js,css);  //依次执行
// exports.default = parallel(html,js,css);  //同时执行

//处理文件
// const{src,dest} = require('gulp');
// const uglify = require('gulp-uglify');
// const rename = require('gulp-rename');


// exports.default = function(){
//     return src('src/js/*.js')
//         .pipe(dest('dist/js'))
//         .pipe(uglify())
//         .pipe(rename({extname:'.min.js'}))
//         .pipe(dest('dist/js'))
// }

//文件监控
// const{watch} = require('gulp');
// watch('src/css/*',{
//     delay:2000
// },function(cb){
//     console.log('文件被修改了');
//     cb();
// })