
const { src, dest, series, watch, parallel } = require('gulp');

const globs = {
    html: "project/**/*.html",
    css: "project/css/**/*.css",
    js: "project/js/**/*.js",
    img: "project/pics/*"
}


const htmlmin = require("gulp-html-minifier-terser");

function htmlTask() {

    return src(globs.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"))
}

exports.h = htmlTask



const concat = require("gulp-concat")
const cleanCSS = require('gulp-clean-css');
function cssTask() {

    return src(globs.css)
        .pipe(concat("style.min.css"))
        .pipe(cleanCSS())
        .pipe(dest("dist/assets/css"))
}


exports.css = cssTask


const terser = require('gulp-terser');
function jsTask() {
    return src(globs.js, { sourcemaps: true })
        .pipe(concat("script.min.js"))
        .pipe(terser())
        .pipe(dest("dist/assets/js", { sourcemaps: "." }))
}


exports.js = jsTask
const optimizeImages = require("gulp-optimize-images");
function imgTask() {

    return src(globs.img)
        .pipe(optimizeImages({
            compressOptions: {
                jpeg: {
                    quality: 50,
                    progressive: true,
                },
                png: {
                    quality: 90,
                    progressive: true,
                    compressionLevel: 6,
                },
                webp: {
                    quality: 80,
                },
            }
        }))
        .pipe(dest('dist/assets/images'))
}
exports.img = imgTask

var spritesmith = require('gulp.spritesmith');
function imgSprite() {

    return src(globs.img)
        .pipe(spritesmith({ cssName: "styleForSprite.css", imgName: "all-in-one.png" }))
        .pipe(dest("project/sprite"))
}

exports.sprite = imgSprite

function watchTask() {
    watch(globs.html, htmlTask)
    watch(globs.css, cssTask)
    watch(globs.js, jsTask)
    watch(globs.img, imgTask)
}

function dummyTask(done) {

    console.log("test !");
    done()
}

exports.default = series(parallel(htmlTask, cssTask, jsTask, imgTask), dummyTask, watchTask)

