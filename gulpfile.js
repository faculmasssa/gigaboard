// @ts-check

const gulp = require('gulp');
const browserify = require('browserify');
const fs = require('fs');
const watchify = require('watchify');

// Scripts usados para cada página, 
// Caso uma pagína use mais de um script, adiciona só o principal, NÃO ADICIONE TODOS PORFAVO 👍
const scripts = ['script-cadastro'];

// Build uma vez
gulp.task('build', function(done) {
    let remaining;
    scripts.forEach((entry, _, entries) => {
        remaining = remaining || entries.length;
        browserify(`./js/${entry}.js`).bundle().pipe(
            fs.createWriteStream(`./public/js/${entry}.js`).on('finish', function() {
                if(!--remaining) done();
            })
        );
    });
});

// Builda várias vezes automaticamente (deixa rodando em outro terminal)
gulp.task('watch', function(done) {
    let remaining;
    scripts.forEach((entry, _, entries) => {
        remaining = remaining || entries.length;
        let bundler = watchify(browserify(`./js/${entry}.js`));
        function bundle() {
            bundler.bundle().pipe(
                fs.createWriteStream(`./public/js/${entry}.js`).on('finish', function() {
                    if(!--remaining) done();
                })
            );
        }
        bundle();
        bundler.on("update", bundle);
    });
});