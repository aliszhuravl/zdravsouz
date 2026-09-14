'use strict';



//npm i --save-dev gulp gulp-watch gulp-autoprefixer gulp-uglify gulp-sass gulp-sourcemaps gulp-rigger gulp-minify-css gulp-csscomb gulp-imagemin imagemin-pngquant browser-sync rimraf gulp-svgo gulp-typograf gulp-merge-media-queries

const sass = require('gulp-sass')(require('sass'));

var gulp = require('gulp'),
	browserSync = require("browser-sync"),
	rigger = require('gulp-rigger'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	cssmin = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	csscomb = require('gulp-csscomb'),
	watch = require('gulp-watch'),
	svgo = require('gulp-svgo'),
	typograf = require('gulp-typograf'),
	rimraf = require('rimraf'),
	mmq = require('gulp-merge-media-queries');



var config = {
    server: {
        baseDir: "./web"
    },
    tunnel: false,
    host: 'localhost',
    port: 9005,
    logPrefix: "dev"
};


var path = {
    build: {
        html: 'web/',
        js: 'web/js/',
        libs: 'web/js/libs',
        css: 'web/css/',
        img: 'web/img/',
        svg: 'web/img/svg',
        fonts: 'web/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        libs: 'src/js/libs/**/*.*',
        style: 'src/sass/main.scss',
        img: 'src/img/**/*.*',
        svg: 'src/img/svg/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.*',
        libs: 'src/js/libs/**/*.*',
        style: 'src/sass/**/*.scss',
        img: 'src/img/**/*.*',
        svg: 'src/img/svg/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './web'
};




    

// запуск сервера +
gulp.task('browserSync', function(done) {
    browserSync.init(config);
    done();
});



//gulp.task('server', function () {
//    browserSync(config);
//});


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});



// сбор html

gulp.task('html:build', function (done) {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(typograf({lang: 'ru'}))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({ stream: true })); // перезагрузка сервера
	done ();
});

// сбор стилей

gulp.task('style:build', function (done) {
    gulp.src(path.src.style)
    //.pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/sass/'],
            //outputStyle: 'compressed',
            //sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(autoprefixer())
        .pipe(csscomb())
        .pipe(mmq({
            log: true
        }))
        //.pipe(cssmin())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({ stream: true })); // перезагрузим сервер

	done ();
});

//
// gulp.task('css:build', function(done) {
//     gulp.src(path.src.css)
//         .pipe(gulp.dest(path.build.css)); // Переносим скрипты в продакшен
//     done();
// });


// сбор js

gulp.task('js:build', function (done) {
    gulp.src(path.src.js)
        .pipe(rigger())
        //.pipe(sourcemaps.init())
        // .pipe(uglify())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({ stream: true })); // перезагрузим сервер
	done ();
});

// gulp.task('js:build', function(done) {
//     gulp.src([path.src.js, '!src/js/main.js'])
//         .pipe(gulp.dest(path.build.js)); // Переносим скрипты в продакшен
//     done();
// });



// обработка картинок


gulp.task('image:build', function (done) {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
       
	    .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов

	done ();
});



gulp.task('svg:build', function (done) {
    gulp.src(path.src.svg)
        .pipe(svgo())
        .pipe(gulp.dest(path.build.svg))
        .pipe(browserSync.reload({ stream: true })); // перезагрузим сервер
	done ();
});


// перенос шрифтов


gulp.task('libs:build', function(done) {
     gulp.src(path.src.libs)
        .pipe(gulp.dest(path.build.libs))
        .pipe(browserSync.reload({ stream: true })); // перезагрузим сервер
    done ();
});

gulp.task('fonts:build', function(done) {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.reload({ stream: true })); // перезагрузим сервер
    done ();
});



// сборка

gulp.task('build', gulp.series('html:build', 'style:build', 'image:build', 'svg:build', 'js:build', 'libs:build', 'fonts:build',function(done) {
    done();
}));



// запуск задач при изменении файлов

gulp.task('watch', function() {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.style, gulp.series('style:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.img, gulp.series('svg:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('libs:build'));
    gulp.watch(path.watch.img, gulp.series('fonts:build'));

});



gulp.task('default', gulp.series('build', gulp.parallel('browserSync', 'watch')));