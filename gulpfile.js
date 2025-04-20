// @ts-check

const fs = require('fs');
const gulp = require('gulp');
const browserify = require('browserify');
const tsify = require('tsify');
const watchify = require('watchify');

const input = './src';
const output = './public/js'

// Scripts usados para cada página, 
// Caso uma pagína use mais de um script, adiciona só o principal, NÃO ADICIONE TODOS PORFAVO 👍
const scripts = ['cadastro', 'painel', 'admin'];

if(!fs.existsSync(output)) {
    fs.mkdirSync(output);
}

/**
 * @param {string} entry 
 */
function getBrowserify(entry) {
    return browserify(`${input}/${entry}.ts`, { standalone: entry }).plugin(tsify);
}

// Build uma vez
gulp.task('build', function(done) {
    let remaining;
    scripts.forEach((entry, _, entries) => {
        remaining = remaining || entries.length;
        getBrowserify(entry).bundle().pipe(
            fs.createWriteStream(`${output}/${entry}.js`).on('finish', function() {
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
        let bundler = watchify(getBrowserify(entry));
        function bundle() {
            bundler.bundle().pipe(
                fs.createWriteStream(`${output}/${entry}.js`).on('finish', function() {
                    if(!--remaining) done();
                })
            );
        }
        bundle();
        bundler.on("update", bundle);
    });
});