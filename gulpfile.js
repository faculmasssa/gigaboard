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
const scripts = ['cadastro', 'painel', 'admin'];

if(!fs.existsSync(output)) {
    fs.mkdirSync(output);
}

// Builda uma vez
gulp.task('build', function() {
    return browserify(scripts.map(s => `${input}/${s}.ts`))
        .plugin(tsify)
        .plugin(factor, { o: scripts.map(s => `${output}/${s}.js`) })
        .bundle()
        .pipe(source('common.js'))
        .pipe(gulp.dest(output));
});

// Builda várias vezes automaticamente (deixa rodando em outro terminal)
gulp.task('watch', function() {
    let bundler = watchify(browserify(scripts.map(s => `${input}/${s}.ts`))
        .plugin(tsify)
        .plugin(factor, { o: scripts.map(s => `${output}/${s}.js`) })
    );
    function bundle() {
        bundler.bundle().pipe(source('common.js')).pipe(gulp.dest(output));
    }
    bundle();
    bundler.on("update", bundle);
});