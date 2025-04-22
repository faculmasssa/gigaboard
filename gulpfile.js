// @ts-check

const factor = require('factor-bundle');
const fs = require('fs');
const gulp = require('gulp');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const watchify = require('watchify');

const input = './src';
const output = './public/js'

// Scripts usados para cada página, 
// Caso uma pagína use mais de um script, adiciona só o principal, NÃO ADICIONE TODOS PORFAVO 👍
const scripts = ['cadastro', 'painel', 'admin'].sort();

if(!fs.existsSync(output)) {
    fs.mkdirSync(output);
}

let scriptsRead = [...scripts];
let files = fs.readdirSync(input, { recursive: true }).sort().filter(f => /** @type {string} */ {
    let arr = /** @type {string} */ (f).split('.');
    let idx = scriptsRead.findIndex(v => v === arr[arr.length-2]);
    if(idx !== -1) {
        scriptsRead.splice(idx, 1);
        return true;
    }else {
        return false;
    }
});

const bundler = browserify(files.map(s => `${input}/${s}`), {debug: true})
    .plugin(tsify)
    .plugin(factor, { o: scripts.map(s => `${output}/${s}.js`) });

// Builda uma vez
gulp.task('build', function() {
    return bundler.bundle().pipe(source('common.js')).pipe(gulp.dest(output));
});

// Builda várias vezes automaticamente (deixa rodando em outro terminal)
gulp.task('watch', function() {
    let watchifyBundler = watchify(bundler);
    function bundle() {
        watchifyBundler.bundle().pipe(source('common.js')).pipe(gulp.dest(output));
    }
    bundle();
    watchifyBundler.on('update', bundle);
});