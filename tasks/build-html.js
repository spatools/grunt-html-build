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
        EOL = grunt.util.linefeed,
        path = require('path'),
        beautifier = require('js-beautify'),
        beautify = {
            js: beautifier.js,
            css: beautifier.css,
            html: beautifier.html
        },

        // Tags Regular Expressions
        regexTagStart = /<!--\s*build:(\w+)\s*(inline)?\s*(optional)?\s*([^\s]*)\s*-->/, // <!-- build:{type} [inline] [optional] {name} --> {} required [] optional
        regexTagEnd = /<!--\s*\/build\s*-->/;  // <!-- /build -->

    //#endregion

    //#region Private Methods

    function getBuildTags(content) {
        var lines = content.replace(/\r\n/g, '\n').split(/\n/),
            tag = false,
            tags = [],
            last;

        lines.forEach(function (l) {
            var tagStart = l.match(regexTagStart),
                tagEnd = regexTagEnd.test(l);

            if (tagStart) {
                tag = true;
                last = { type: tagStart[1], inline: !!tagStart[2], optional: !!tagStart[3], name: tagStart[4], lines: [] };
                tags.push(last);
            }

            // switch back tag flag when endbuild
            if (tag && tagEnd) {
                last.lines.push(l);
                tag = false;
            }

            if (tag && last) {
                last.lines.push(l);
            }
        });

        return tags;
    }
    function validateBlockWithName(tag, params) {
        var src = params[tag.type + "s"][tag.name];
        if (src) {
            var opt = {},
                files = src;

            if (_.isObject(src)) {
                opt = src;
                files = src.files;

                delete opt.files;
            }
            
            return grunt.file.expand(opt, files);
        }
    }
    function validateBlockAlways(tag) {
        return true;
    }

    //#endregion

    //#region Processors Methods

    function createTemplateData(options, extend) {
        return {
            data: extend ?
                    _.extend({}, options.data, extend) :
                    options.data
        };
    }
    function processTemplate(template, options, extend) {
        return grunt.template.process(template, createTemplateData(options, extend));
    }
    function processHtmlTagTemplate(options, extend, inline) {
        var template = templates[options.type + (inline ? "-inline" : "")];
        return processTemplate(template, options, extend);
    }

    function processHtmlTag(options) {
        if (options.inline) {
            var content = options.files.map(grunt.file.read).join(EOL);
            return processHtmlTagTemplate(options, { content: content }, true);
        }
        else {
            return options.files.map(function (f) {
                var url = path.relative(options.dest, f).replace(/\\/g, '/');
                return processHtmlTagTemplate(options, { src: url });
            }).join(EOL);
        }
    }

    //#endregion

    //#region Processors / Validators / Templates

    var
        templates = {
            'script': '<script type="text/javascript" src="<%= src %>"></script>',
            'script-inline': '<script type="text/javascript"><%= content %></script>',
            'style': '<link type="text/css" rel="stylesheet" href="<%= src %>" />',
            'style-inline': '<style><%= content %></style>'
        },
        validators = {
            script: validateBlockWithName,
            style: validateBlockWithName,
            section: validateBlockWithName,

            process: validateBlockAlways,
            remove: validateBlockAlways,

            //base method
            validate: function (tag, params) {
                return validators[tag.type](tag, params);
            }
        },
        processors = {
            script: processHtmlTag,
            style: processHtmlTag,
            section: function (options) {
                return options.files.map(grunt.file.read).join(EOL);
            },

            process: function (options) {
                return options.lines
                                .map(function (l) { return processTemplate(l, options); })
                                .join(EOL)
                                .replace(regexTagStart, "")
                                .replace(regexTagEnd, "");
            },
            remove: function (options) {
                return "";
            },

            //base method
            transform: function (options) {
                return processors[options.type](options);
            }
        };

    //#endregion

    grunt.registerMultiTask('htmlbuild', "Grunt HTML Builder - Replace scripts and styles, Removes debug parts, append html partials, Template options", function () {
        var config = grunt.config(),
            params = this.options({
                beautify: false,
                logOptionals: false,
                scripts: {},
                styles: {},
                sections: {},
                data: {}
            });

        this.files.forEach(function (file) {
            var dest = file.dest || "",
                destPath, content, tags;

            file.src.forEach(function (src) {
                destPath = path.join(dest, path.basename(src));
                content = grunt.file.read(src).toString();
                tags = getBuildTags(content);

                tags.forEach(function (tag) {
                    var raw = tag.lines.join(EOL),
                        result = "",
                        tagFiles = validators.validate(tag, params);

                    if (tagFiles) {
                        var options = _.extend({}, tag, {
                            data: _.extend({}, config, params.data),
                            files: tagFiles,
                            dest: dest
                        });

                        result = processors.transform(options);
                    }
                    else if (tag.optional) {
                        if (params.logOptionals)
                            grunt.log.error().error("Tag with type: '" + tag.type + "' and name: '" + tag.name + "' is not configured in your Gruntfile.js but is set optional, deleting block !");
                    }
                    else {
                        grunt.fail.warn("Tag with type '" + tag.type + "' and name: '" + tag.name + "' is not configured in your Gruntfile.js !");
                    }

                    content = content.replace(raw, result);
                });

                if (params.beautify) {
                    content = beautify.html(content, _.isObject(params.beautify) ? params.beautify : {});
                }

                // write the contents to destination
                grunt.file.write(destPath, content);
                grunt.log.writeln("File " + destPath + " created !");
            });
        });
    });
};