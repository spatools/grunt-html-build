/*
 * grunt-html-build
 * https://github.com/spatools/grunt-html-build
 * Copyright (c) 2013 SPA Tools
 * Code below is licensed under MIT License
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
 * ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module.exports = function (grunt) {
    //#region Global Properties

    var // Init 
        _ = grunt.util._,
        path = require('path'),

        // Tags Regular Expressions
        regexTagStart = /<!--\s*build:(\w+)\s*(inline)?\s*(.+)\s*-->/, // <!-- build:{target} [inline] {name} --> {} required [] optional
        regexTagEnd = /<!--\s*\/build\s*-->/;  // <!-- /build -->

    //#endregion

    //#region Private Methods

    function getBuildTags(body) {
        var lines = body.replace(/\r\n/g, '\n').split(/\n/),
			block = false,
            blocks = [],
			last;

        lines.forEach(function (l) {
            var tagStart = l.match(regexTagStart),
				tagEnd = regexTagEnd.test(l);

            if (tagStart) {
                block = true;
                last = { type: tagStart[1], inline: !!tagStart[2], name: tagStart[3], content: [] };
                blocks.push(last);
            }

            // switch back block flag when endbuild
            if (block && tagEnd) {
                last.content.push(l);
                block = false;
            }

            if (block && last) {
                last.content.push(l);
            }
        });

        return blocks;
    }
    function validateBlockWithName(block) {
        return params[block.types + "s"][block.name];
    }
    function validateBlockAlways(block) {
        return true;
    }

    //#endregion

    //#region Processors Methods

    function getIndentedFile(file, indent, eol) {
        var content = grunt.file.read(file),
            lines = content.replace(/\r\n/g, '\n').split(/\n/)
                           .map(function (l) { return indent + l });

        return lines.join(eol);
    }
    function createTemplateData(block, dest) {
        return { data: _.extend({}, block.data, !!dest ? { dest: dest } : {}) };
    }
    function processTemplate(template, block, dest) {
        return grunt.template.process(template, createTemplateData(block, dest));
    }
    function processTag(block) {
        var indent = (block.content[0].match(/^\s*/) || [])[0],
            files = grunt.file.expand(block.dest);

        if (block.inline) {
            var content = files.map(function (f) { return getIndentedFile(f, indent, block.eol); }).join(block.eol);
            return processTemplate(templates[block.type + "-inline"], block, content);
        }
        else {
            return files.map(function (f) {
                return indent + processTemplate(templates[block.type], block, f);
            }).join(block.eol);
        }

        return lines.join(block.eol);
    }

    //#endregion

    //#region Processors / Validators / Templates

    var
        templates = {
            'script': '<script type="text/javascript" src="<%= dest %>"></script>',
            'style': '<link type="text/css" rel="stylesheet" href="<%= dest %>">',
            'script-inline': '<style><%= dest %></style>',
            'style-inline': '<script type="text/javascript"><%= dest %></script>'
        },
        validators = {
            script: validateBlockWithName,
            style: validateBlockWithName,
            section: validateBlockWithName,

            process: validateBlockAlways,
            remove: validateBlockAlways,

            //base method
            validate: function (block) {
                return validators[block.type](block);
            }
        },
        processors = {
            script: processTag,
            style: processTag,
            section: function (block) {
                var indent = (block.content[0].match(/^\s*/) || [])[0],
                    files = grunt.file.expand(block.dest);

                return files.map(function (f) { return getIndentedFile(f, indent, block.eol); }).join(block.eol);
            },

            process: function (block) {
                var indent = (block.content[0].match(/^\s*/) || [])[0],
                    lines = block.content.map(function (l) { return indent + processTemplate(l, block); });

                return lines.join(block.eol);
            },
            remove: function (block) {
                return "";
            },

            //base method
            transform: function (block) {
                return processors[block.type](block);
            }
        };

    //#endregion

    grunt.registerMultiTask('htmlbuild', "Grunt HTML Builder - Replace scripts and styles, Removes debug parts, append html partials, Template options", function () {
        var config = grunt.config(),
            params = this.options({
                scripts: {},
                styles: {},
                sections: {},
                data: {}
            });

        this.files.forEach(function (file) {
            var src = file.src[0], dest = file.dest,
                content = grunt.file.read(file.src[0]).toString(),
                blocks = getBuildTags(content),
                eol = /\r\n/g.test(content) ? '\r\n' : '\n'; // get EOL from content

            blocks.forEach(function (block) {
                var raw = block.content.join(eol),
                    result = "",
                    destPath = validators.validate(block);

                if (!!destPath) {
                    block.data = _.extend({}, config, params.data, { dest: destPath, eol: eol });
                    result = processors.transform(block);
                }
                //else 
                //    grunt.log.error("Error while validating block { type: '', name: '' }, Name not found in task options, deleting block !");

                content = content.replace(raw, result);
            });

            // write the contents to destination
            var filePath = dest ? path.join(dest, path.basename(src)) : src;
            grunt.file.write(filePath, content);
        });
    });
};