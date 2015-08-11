var gulp = require('gulp'),
    bower = require('main-bower-files'),
    bowerNormalize = require('gulp-bower-normalize'),
    tsc = require('gulp-typescript'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    rm = require('gulp-rm'),
    nodemon = require('gulp-nodemon');

var sources = {
    server: ['./server/typings/**/*.d.ts', './server/**/*.ts'],
    client: ['./client/typings/**/*.d.ts', './client/**/*.ts'],
    html: ['./client/**/*.html'],
    css: ['./client/**/*.css'],
    bower: ['./bower_components/**/*']
}

var serverProject = tsc.createProject({
    target: 'ES5',
    declarationFiles: false,
    module: 'commonjs',
    noExternalResolve: true,
    sortOutput: true
});

gulp.task('server', function() {
    return gulp.src(sources.server)
        .pipe(tsc(serverProject))
        .pipe(gulp.dest('.'));
});

var clientProject = tsc.createProject({
    target: 'ES5',
    declarationFiles: false,
    noExternalResolve: true,
    sortOutput: true
});

gulp.task('client', function() {
    return gulp.src(sources.client)
        .pipe(tsc(clientProject))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('css', function() {
    return gulp.src(sources.css)
        .pipe(gulp.dest('./public/css'));
});

gulp.task('html', function() {
    return gulp.src(sources.html)
        .pipe(gulp.dest('./public'));
});

gulp.task('bower', function() {
    return gulp.src(bower(), {base: './bower_components'})
        .pipe(bowerNormalize({flatten: true}))
        .pipe(gulp.dest('./public/vendor/'));
});

gulp.task('clean', function() {
    return gulp.src(['public/**/*'], {read: false})
        .pipe(rm());
})

gulp.task('pre-watch', function(done) {
    runSequence(
        'clean',
        ['bower', 'client', 'css', 'html', 'server'],
        done
    );
});

gulp.task('watch', ['pre-watch'], function() {
    gulp.watch(sources.bower, ['bower']);
    gulp.watch(sources.client, ['client']);
    gulp.watch(sources.css, ['css']);
    gulp.watch(sources.html, ['html']);
    gulp.watch(sources.server, ['server']);
});

gulp.task('default', ['server', 'bower', 'client', 'css', 'html']);

gulp.task('serve', ['watch'], function() {
    nodemon({
        script: 'index.js'
    });
});