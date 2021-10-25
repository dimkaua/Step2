
const gulp = require('gulp');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const cssMinify = require('gulp-css-minify');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');



const buildSass = function() {
return gulp.src("src/scss/*.scss")
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({
        browsers: ['> 0.1%'],
        cascade: false
    }))
    .pipe(cleanCSS({level: 2}))
    .pipe(gulp.dest("./dist/style"))
    .pipe(browserSync.stream());
};

const buildJs = function() {
    return gulp.src("src/js/*.js")
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
    };

gulp.task('serve', function() {
    browserSync.init({
        server: "./"
    });
    gulp.watch("src/**/*.js", buildJs);
    gulp.watch("src/**/*.scss", buildSass);
    gulp.watch("index.html").on('change', browserSync.reload);

});

 

gulp.task('minify-css', () => {
    return gulp.src('dist/**/*.css')
      .pipe(cleanCSS({level: 2}))
      .pipe(gulp.dest('dist'));
  });

  
gulp.task('cleanAll', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});




const buildImages = () => (
    gulp.src('src/image/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/image/'))
    .pipe(browserSync.stream())
)





gulp.task("imagemin", buildImages);
gulp.task('compress', buildJs);
gulp.task('sass', buildSass );
gulp.task('build', gulp.series('cleanAll', gulp.parallel('imagemin', 'sass', 'compress')));
gulp.task('dev', gulp.series(gulp.parallel('imagemin', 'sass', 'compress'), 'serve'));