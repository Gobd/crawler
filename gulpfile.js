"use strict";

const gulp = require(`gulp`);

const babel = require(`gulp-babel`);
const concat = require(`gulp-concat`);
const minify = require(`gulp-minify`);
const annotate = require(`gulp-ng-annotate`);
const rename = require(`gulp-rename`);
const uglify = require(`gulp-uglify`);
const htmlMin = require(`gulp-htmlmin`);
const uglyCss = require(`gulp-uglifycss`);
const gutil = require(`gulp-util`);

let env = `development`;
gulp.task(`js`, () => {
    return gulp.src(`./public/**/*.js`)
        .pipe(annotate())
        .pipe(babel(
            {presets: [`es2015`]}
        ))
        .pipe(concat(`all.js`))
        .pipe(env === `production` ? minify():gutil.noop())
        .pipe(rename(`all.min.js`))
        .pipe(env === `production` ? uglify():gutil.noop())
        .pipe(gulp.dest(`dist/js`));
});

gulp.task(`css`, () => {
    return gulp.src(`./public/style/*.css`)
        .pipe(uglyCss())
        .pipe(gulp.dest(`dist/style`));
});

gulp.task(`views`, () => {
    return gulp.src(`./public/routes/*.html`)
        .pipe(htmlMin(
            {collapseWhitespace: true}
        ))
        .pipe(gulp.dest(`dist/routes`))
});

gulp.task(`index`, () => {
    return gulp.src(`./public/index.html`)
        .pipe(htmlMin(
            {collapseWhitespace: true}
        ))
        .pipe(gulp.dest(`dist/`))
});

gulp.task(`images`, () => {
    return gulp.src(`./public/images/*.png`)
        .pipe(gulp.dest(`dist/images`));
});

gulp.task(`deploy`, [`js`, `css`, `views`, `index`, `images`], (next) => {
    env = `production`;
    return next();
});

gulp.task(`dev`, [`js`, `css`, `views`, `index`, `images`], (next) => {
    env = `development`;

    return next();
});