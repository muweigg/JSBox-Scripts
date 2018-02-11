const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const inject = require('gulp-inject');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const prefixer = require('gulp-autoprefixer');
const del = require('del');

gulp.task('embed:vendors',
    () => gulp.src('./src/js/libs/**/*.js')
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('./tmp'))
);

gulp.task('embed:js',
    () => gulp.src([
        './src/js/embed/**/*.js',
        './src/js/embed/embed.js'
    ])
    .pipe(concat('embed.js'))
    .pipe(babel({
        presets: ['es2015', 'minify']
    }))
    // .pipe(uglify())
    .pipe(gulp.dest('./tmp'))
);

gulp.task('embed:css',
    () => gulp.src('./src/scss/embed.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer({ browsers: ['> 5%', 'safari >= 9'], cascade: false }))
        .pipe(cleanCSS({ level: { 1: { specialComments: false }}}))
        .pipe(gulp.dest('./tmp'))
);

gulp.task('template',
    () => gulp.src('./src/template/template.html')
        .pipe(inject(gulp.src([
                './tmp/embed.css',
                './tmp/vendors.js',
                './tmp/embed.js'
            ]), {
            starttag: '<!-- inject:{{path}} -->',
            transform: function (filePath, file) {
                const ext = filePath.substr(filePath.lastIndexOf('.') + 1);
                let content = file.contents.toString('utf8');
                if (ext === 'js') content = `<script>${content}</script>`;
                if (ext === 'css') content = `<style>${content}</style>`;
                return content;
            }
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./tmp'))
);

gulp.task('build:template', gulp.series(gulp.parallel('embed:vendors', 'embed:js', 'embed:css'), 'template'));

gulp.task('build',
    () => gulp.src([
            './src/js/Update.js',
            './src/js/downloader.js',
            './src/js/*.js',
        ])
        .pipe(concat('MUIDownloader.js'))
        .pipe(inject(gulp.src(['./tmp/template.html']), {
            starttag: '<!-- inject:template -->',
            transform: function (filePath, file) {
                return encodeURIComponent(file.contents.toString('utf8'));
            }
        }))
        .pipe(babel({
            parserOpts: {
                allowReturnOutsideFunction: true, 
            },
            presets: ['minify']
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('./'))
);

gulp.task('watch:embed:vendors',
    () => gulp.watch('./src/js/libs/**/*.js', gulp.series('embed:vendors')));

gulp.task('watch:embed:js',
    () => gulp.watch('./src/js/embed/*.js', gulp.series('embed:js')));

gulp.task('watch:embed:css',
    () => gulp.watch('./src/scss/embed.scss', gulp.series('embed:css')));

gulp.task('watch:template',
    () => gulp.watch(['./tmp/**/*.{js,css}', './src/template/*.html'], gulp.series('template')));

gulp.task('watch:build',
    () => gulp.watch(['./src/js/*.js', './tmp/*.html'], gulp.series('build')));

gulp.task('watch', gulp.parallel([
    'watch:embed:vendors',
    'watch:embed:js',
    'watch:embed:css',
    'watch:template',
    'watch:build'
]));

gulp.task('dev', gulp.series('build:template', 'build', 'watch'));

gulp.task('default', gulp.parallel('dev'));