/*eslint-disable strict*/
'use strict';

var templateDir = '__templates__';

module.exports = function (gulp) {

    var path = require('path');
    var replace = require('gulp-replace');
    var rename = require('gulp-rename');

    function _create(name, cb) {

        gulp.src(path.join('gulp_tasks', templateDir, 'components/*'))
            .pipe(replace(/\$\{name}/g, name))
            .pipe(rename(function (path) {
                if (path.extname === '.tmp') {
                    path.extname = '';
                    path.basename = path.basename.replace(/^\w+/, name);
                }
            }))
            .pipe(gulp.dest('./src/components/' + name));

        cb();
    }

    gulp.task('component', function (cb) {

        var fs = require('fs');
        var prompt = require('prompt');

        prompt.start();
        prompt.message = prompt.delimiter = '';
        prompt.get.apply(null, (function repeater() {
            return [
                {
                    name: 'fileName',
                    required: true,
                    message: 'Name must not include special chars or spaces and begin with a capital letter',
                    description: 'Component name:',
                    pattern: /^[A-Z]\w+$/
                },
                function (err, result) {

                    if (err) {
                        console.error(err);
                        return cb();
                    }

                    var name = result.fileName;
                    var dir = './src/components/' + name;

                    fs.stat(dir, function (err, stat) {
                        // overwrite existing component
                        if (stat) {
                            return prompt.confirm('Overwrite existing component?', function (err, result) {
                                if (err || !result) {
                                    return prompt.get.apply(null, repeater());
                                }

                                _create(name, cb); //overwrite
                            });
                        }

                        _create(name, cb);
                    });
                }];
        })());
    });
};
