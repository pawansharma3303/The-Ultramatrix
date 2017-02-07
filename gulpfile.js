var gulp=require("gulp");
var sass=require("gulp-sass");
var concat=require("gulp-concat");
var cleancss=require("gulp-clean-css");
var rename=require("gulp-rename");
var uglify=require("gulp-uglify");
var bs=require("browser-sync");
var connect=require("gulp-connect-php");

var app="zed";
var version="v1.0.0";
var paths={
      src:{
        scss:"src/scss/*.scss",
        scssAll:"src/scss/**/*.scss",
        js:"src/js/*.js"
      },
      dest:{
        scss:"deploy/css",
        js:"deploy/js"
      },
      deploy:"deploy/**/*.*"
};

gulp.task("serve",["sass","scripts"],function(){
    connect.server({}, function (){
      bs({
        proxy: 'localhost:80',
        notify:false
      });
    });

    gulp.watch(paths.src.scssAll,['sass']);
    gulp.watch(paths.src.scss,['sass']);
    gulp.watch(paths.src.js,['scripts']);
    gulp.watch(paths.deploy).on('change', function () {
      bs.reload();
    });
})

gulp.task('sass', function() {
  return gulp.src(paths.src.scss)
        .pipe(sass())
        .pipe(rename(app+"-"+version+".min.css"))
        .pipe(cleancss())
        .pipe(gulp.dest(paths.dest.scss))
        .pipe(bs.stream());
});

gulp.task("scripts",function(){
    return gulp.src(paths.src.js)
           .pipe(concat(app+"-"+version+'.js'))
           .pipe(gulp.dest(paths.dest.js))
           .pipe(rename(app+"-"+version+'.min.js'))
           .pipe(uglify())
           .pipe(gulp.dest(paths.dest.js))
           .pipe(bs.stream());
})
