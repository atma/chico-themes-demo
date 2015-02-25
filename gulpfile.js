// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var gulp       = require('gulp'),
    $          = require('gulp-load-plugins')(),
    rimraf     = require('rimraf'),
    sequence   = require('run-sequence')
//,modRewrite = require('connect-modrewrite');

// 2. TEMPLATES SETTINGS
// - - - - - - - - - - - - - - -
var VERSION = '2.0.0';

// UI JavaScript
var uiJS = [
    'bower_components/chico/build/ui/chico.js'
];
// Mobile JavaScript
var mobileJS = [
    'bower_components/chico/build/mobile/chico.js'
];

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function(cb) {
    rimraf('./build', cb);
});


// Copies themes related assets
gulp.task('copy', function() {
    var dirs = [
        './bower_components/chico/src/shared/assets/**/*.*'
    ];

    // Mesh CSS
    gulp
        .src('./bower_components/chico/vendor/mesh.min.css')
        .pipe(gulp.dest('./build/vendor/'));


    // Static data
    gulp
        .src('./demo_data/**')
        .pipe(gulp.dest('./build/'));

    // Everything in the assets folder
    return gulp
        .src(dirs, {
            base: './bower_components/chico/src/shared/'
        })
        .pipe(gulp.dest('./build'));
});


// Processes templates for all themes
gulp.task('templates', ['templates:mp', 'templates:alt'], function(){
    return gulp.src('./templates/index.html')
        .pipe(gulp.dest('./build/'));
});

// Processes templates for mp theme
gulp.task('templates:mp', function(cb) {
    gulp.src(['templates/ui.html'])
        .pipe($.replace('{{VERSION}}', VERSION))
        .pipe(gulp.dest('build/mp'));

    gulp.src(['templates/mobile.html'])
        .pipe($.replace('{{VERSION}}', VERSION))
        .pipe(gulp.dest('build/mp'));

    return cb();
});

// Processes templates for an alt theme
gulp.task('templates:alt', function(cb) {
    gulp.src(['templates/ui.html'])
        .pipe($.replace('{{VERSION}}', VERSION))
        .pipe(gulp.dest('build/alt'));

    gulp.src(['templates/mobile.html'])
        .pipe($.replace('{{VERSION}}', VERSION))
        .pipe(gulp.dest('build/alt'));

    return cb();
});


// Compiles Sass for all themes
gulp.task('sass', ['sass:mp', 'sass:alt']);

// Compiles Sass for mp theme
gulp.task('sass:mp', function (cb) {
    gulp.src('themes/mp/theme-ui.scss')
        .pipe($.sass())
        .pipe(gulp.dest('build/mp'));

    gulp.src('themes/mp/theme-mobile.scss')
        .pipe($.sass())
        .pipe(gulp.dest('build/mp'));

    return cb();
});

// Compiles Sass for alt theme
gulp.task('sass:alt', function (cb) {
    gulp.src('themes/alt/theme-ui.scss')
        .pipe($.sass())
        .pipe(gulp.dest('build/alt'));

    gulp.src('themes/alt/theme-mobile.scss')
        .pipe($.sass())
        .pipe(gulp.dest('build/alt'));

    return cb();
});



// Compiles and copies Chico's JavaScript and it's dependencies for an every theme
gulp.task('uglify', ['uglify:mp', 'uglify:alt']);

gulp.task('uglify:mp', function() {
    // UI JavaScript
    gulp.src(uiJS)
        .pipe($.uglify({
            beautify: true,
            mangle: false
        }).on('error', function(e) {
            console.log(e);
        }))
        .pipe($.concat('ui.js'))
        .pipe(gulp.dest('./build/mp/'));

    // Mobile JavaScript
    return gulp.src(mobileJS)
        .pipe($.uglify({
            beautify: true,
            mangle: false
        }).on('error', function(e) {
            console.log(e);
        }))
        .pipe($.concat('mobile.js'))
        .pipe(gulp.dest('./build/mp/'));
});

gulp.task('uglify:alt', function() {
    // UI JavaScript
    gulp.src(uiJS)
        .pipe($.uglify({
            beautify: true,
            mangle: false
        }).on('error', function(e) {
            console.log(e);
        }))
        .pipe($.concat('ui.js'))
        .pipe(gulp.dest('./build/alt/'));

    // Mobile JavaScript
    return gulp.src(mobileJS)
        .pipe($.uglify({
            beautify: true,
            mangle: false
        }).on('error', function(e) {
            console.log(e);
        }))
        .pipe($.concat('mobile.js'))
        .pipe(gulp.dest('./build/alt/'));
});


// Starts a test server, which you can view at http://localhost:8080
gulp.task('server:start', function() {
    $.connect.server({
        root: './build',
        livereload: true
    });
});


// Livereload
gulp.task('lr', function () {
    gulp.src('./build/**/*.html')
        .pipe($.connect.reload());
});


// Builds all templates at once, without starting a server
gulp.task('build', function() {
    return sequence('clean', ['copy', 'sass', 'uglify', 'templates'], function() {
        console.log("All themes were successfully built.");
    });
});


// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['build', 'server:start'], function() {
    // Watch Sass
    gulp.watch(['./bower_components/chico/src/**/*.scss', './themes/**/*'], ['sass']);

    // Watch JavaScript
    gulp.watch(['./bower_components/chico/src/**/*.js'], ['uglify']);

    // Watch static files
    gulp.watch(['./demo_data/static/**/*.*', './bower_components/chico/src/shared/assets/**/*'], ['copy']);

    // Watch templates
    gulp.watch(['./templates/**/*.html'], ['templates']);

    // Watch LiveReload
    gulp.watch(['./build/**/*'], ['lr']);
});
