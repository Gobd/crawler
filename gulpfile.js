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

gulp.task(`js`, () => {
    return gulp.src(`./public/js/**/*.js`)
        .pipe(annotate())
        .pipe(babel(
            {presets: [`es2015`]}
        ))
        .pipe(concat(`all.js`))
        .pipe(minify())
        .pipe(rename(`all.min.js`))
        .pipe(uglify())
        .pipe(gulp.dest(`dist/js`));
});

gulp.task(`css`, () => {
    return gulp.src(`./public/style/*.css`)
        .pipe(uglyCss())
        .pipe(gulp.dest(`dist/css`));
});

gulp.task(`views`, () => {
    return gulp.src(`./public/routes/*.html`)
        .pipe(htmlMin(
            {collapseWhitespace: true}
        ))
        .pipe(gulp.dest(`dist/views`))
});

gulp.task(`index`, () => {
    return gulp.src(`./public/index.html`)
        .pipe(htmlMin(
            {collapseWhitespace: true}
        ))
        .pipe(gulp.dest(`dist/views`))
});

gulp.task(`deploy`, [js, css, views, index], (next) => {
    process.env.NODE_ENV = `production`;
    return next();
});

gulp.task(`dev`, [js, css, views, index], (next) => {
    process.env.NODE_ENV = `development`;

    return next();
});