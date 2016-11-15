(() => {
    'use strict';

  var gulp = require('gulp');
  var nodemon = require('gulp-nodemon')
  let browserSync = require('browser-sync');
  var reload      = browserSync.reload;
  
  gulp.task('default', ['browser-sync']);

  
  gulp.task('nodemon', () => {
    nodemon({
      script: 'app.js'
    , ext: 'js html'
    , env: { 'NODE_ENV': 'development' }
    });
  });
  
  gulp.task('js-watch',  browserSync.reload);
  
  gulp.task('sync', ['browser-sync']);
  
      gulp.task('browser-sync', ['nodemon'], () => {
          browserSync.init(null, {
              proxy: 'http://localhost:3000',
              files: [
                  'views/*.jade',
                  'public/js/**/*.js',
                  'public/img/*',
                  'public/stylesheets/**/*.scss'
              ],
              port: 8083
          });
        gulp.watch("views/*.jade", ['js-watch']);
      });
  
    
  
})();