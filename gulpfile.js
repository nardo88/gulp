// импортируем gulp
const gulp = require('gulp');


const source = require('vinyl-source-stream');
const browserify = require('browserify');
// путь куда будем сохранять файлы продакшена
const dist = 'C:/Users/nardo/Desktop/openserver/domains/vue/admin';
const sass = require('gulp-sass');

// копирует html
gulp.task('copy-html', () => {
    // метод src получает файл путь до которого мы передадим
    return gulp.src('./app/src/index.html')
            // pipe - это следующая задача. dect - переносит туда куда укажем
            .pipe(gulp.dest(dist));
});

// перемещение папки api со всем содержимым
gulp.task('copy-api', () => {
    // метод src получает файл путь до которого мы передадим
    return gulp.src('./app/api/**/*.*')
            // pipe - это следующая задача. dect - переносит туда куда укажем
            .pipe(gulp.dest(dist + '/api'));
});


// перемещение папки assets со всем содержимым
gulp.task('copy-assets', () => {
    // метод src получает файл путь до которого мы передадим
    return gulp.src('./app/assets/**/*.*')
            // pipe - это следующая задача. dect - переносит туда куда укажем
            .pipe(gulp.dest(dist + '/assets'));
});


// собирает JavaScript
gulp.task('build-js', () => {
    return browserify('./app/src/main.js', {debug: true})
      .transform("babelify", {presets: ["@babel/preset-env"], sourceMaps: true})
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(dist));
})

// собираем стили
gulp.task('build-sass', () => {
    return gulp.src('./app/scss/**/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist));
})


// задача что бы запускать все задачи автоматически при сохранении файлов
gulp.task('watch', () => {
    // отслеживаем html
    gulp.watch('./app/src/index.html', gulp.parallel('copy-html'));
    // API и ASSETS
    gulp.watch('./app/api/**/*.*', gulp.parallel('copy-api'));
    gulp.watch('./app/assets/**/*.*', gulp.parallel('copy-assets'));
    // отслеживаем JavaScript
    gulp.watch('./app/src/**/*.js', gulp.parallel('build-js'));
    gulp.watch('./app/scss/**/*.scss', gulp.parallel('build-sass'));
})


// задача для окончательной сборки проекта на продакшен
gulp.task('build', gulp.parallel('copy-html', 'copy-api', 'copy-assets', 'build-js', 'build-sass'));


// дефолтная задача т.е. в консоле просто пишем слово gulp и проект сбилдится и включится watch
gulp.task('default', gulp.parallel('watch', 'build'));