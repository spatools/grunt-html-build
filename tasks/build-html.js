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
        URL = require('url'),
        path = require('path'),
        beautifier = require('js-beautify'),
        beautify = {
            js: beautifier.js,
            css: beautifier.css,
            html: beautifier.html
        },

        // Tags Regular Expressions
        regexTagStartTemplate = "<!--\\s*%parseTag%:(\\w+)\\s*(inline)?\\s*(optional)?\\s*(recursive)?\\s*(noprocess)?\\s*([^\\s]*)\\s*(?:\\[(.*)\\])?\\s*-->", // <!-- build:{type} (inline) (optional) (recursive) {name} [attributes...] --> {} required () optional
        regexTagEndTemplate = "<!--\\s*\\/%parseTag%\\s*-->", // <!-- /build -->
        regexTagStart = "",
        regexTagEnd = "",
        isFileRegex = /\.(\w+){2,4}$/;

    //#endregion

    //#region Private Methods

    function getBuildTags(content) {
        var lines = content.replace(/\r?\n/g, '\n').split(/\n/),
            tag = false,
            tags = [],
            last;

        lines.forEach(function (l) {
            var tagStart = l.match(new RegExp(regexTagStart)),
                tagEnd = new RegExp(regexTagEnd).test(l);

            if (tagStart) {
                tag = true;
                last = {
                    type: tagStart[1],
                    inline: !!tagStart[2],
                    optional: !!tagStart[3],
                    recursive: !!tagStart[4],
                    noprocess: !!tagStart[5],
                    name: tagStart[6],
                    attributes: tagStart[7],
                    lines: []
                };
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
    function defaultProcessPath(pathes, params, opt) { //takes an array of paths and validates them
        var local = grunt.file.expand(opt, pathes),
            remote = _.map(pathes, path.normalize).filter(function (path) { //for loading from cdn
                return /^((http|https):)?(\\|\/\/)/.test(path); //is http, https, or //
            });

        if (params.relative && opt.cwd) {
            local = local.map(function (src) { return path.join(opt.cwd, src); });
        }

        return _.uniq(local.concat(remote));
    }
    function validateBlockWithName(tag, params) {
        var src = params[tag.type + "s"],

            keys = tag.name.split("."),
            ln = keys.length;

        for (var i = 0; i < ln; i++) {
            src = src[keys[i]]; // Search target
        }

        if (src) {
            var opt = {},
                files = src;

            if (_.isObject(src)) {
                if (src.files) {
                    opt = _.omit(src, "files");
                    files = src.files;
                }
                else {
                    // if paths are named, just take values
                    files = _.values(src);
                }
            }

            if (!Array.isArray(files)) {
                files = [files];
            }

            return params.processPath(files, params, opt);
        }
    }
    function validateBlockAlways(tag) {
        return true;
    }

    function setTagRegexes(parseTag) {
        regexTagStart = regexTagStartTemplate.replace(/%parseTag%/, function () { return parseTag });
        regexTagEnd = regexTagEndTemplate.replace(/%parseTag%/, function () { return parseTag });
    }

    //#endregion

    //#region Processors Methods

    function createTemplateData(options, src, attrs) {
        var extend = {};

        if (src) {
            extend.src = src;
        }

        if (attrs) {
            extend.attributes = attrs;
        }

        return {
            data: _.extend({}, options.data, extend)
        };
    }
    function processTemplate(template, options, src, attrs) {
        return grunt.template.process(template, createTemplateData(options, src, attrs));
    }
    function createAttributes(options, src) {
        var attrs = options.attributes || "";

        if (options.type === "script") {
            attrs = 'type="text/javascript" ' + attrs;
        }
        else if (options.type === "style" && !options.inline) {
            if (path.extname(src) === ".less") {
                attrs = 'type="text/css" rel="stylesheet/less" ' + attrs;
            }
            else {
                attrs = 'type="text/css" rel="stylesheet" ' + attrs;
            }
        }

        return attrs.trim();
    }
    function processHtmlTagTemplate(options, src) {
        var template = templates[options.type + (options.inline ? "-inline" : "")],
            attrs = createAttributes(options, src);

        if (!options.inline || options.noprocess) {
            return template
                    .replace("<%= src %>", src)
                    .replace("<%= attributes %>", attrs);
        }
        else {
            return processTemplate(template, options, src, attrs);
        }
    }

    function processHtmlTag(options) {
        if (options.inline) {
            var content = options.files.map(grunt.file.read).join(EOL);
            return processHtmlTagTemplate(options, content);
        }
        else {
            return options.files.map(function (f) {
                var url = options.relative ? path.relative(options.dest, f) : f;

                url = url.replace(/\\/g, '/');

                if (options.prefix) {
                    url = URL.resolve(options.prefix.replace(/\\/g, '/'), url);
                }

                return processHtmlTagTemplate(options, url);
            }).join(EOL);
        }
    }

    //#endregion

    //#region Processors / Validators / Templates

    var
        templates = {
            'script': '<script <%= attributes %> src="<%= src %>"></script>',
            'script-inline': '<script <%= attributes %>><%= src %></script>',
            'style': '<link <%= attributes %> href="<%= src %>" />',
            'style-inline': '<style <%= attributes %>><%= src %></style>'
        },
        validators = {
            script: validateBlockWithName,
            style: validateBlockWithName,
            section: validateBlockWithName,

            process: validateBlockAlways,
            remove: validateBlockAlways,

            //base method
            validate: function (tag, params) {
                if (!validators[tag.type]) {
                    return false;
                }

                return validators[tag.type](tag, params);
            }
        },
        processors = {
            script: processHtmlTag,
            style: processHtmlTag,
            section: function (options) {
                return options.files.map(function (f) {
                    var content = grunt.file.read(f).toString();

                    return options.recursive ?
                        transformContent(content, options.params, options.dest) :
                        content;
                }).join(EOL);
            },

            process: function (options) {
                return options.lines
                                .map(function (l) { return processTemplate(l, options); })
                                .join(EOL)
                                .replace(new RegExp(regexTagStart), "")
                                .replace(new RegExp(regexTagEnd), "");
            },
            remove: function (options) {
                if (!options.name) return "";

                var targets = options.name.split(",");
                if (targets.indexOf(grunt.task.current.target) < 0) {
                    return options.lines.join(EOL).replace(new RegExp(regexTagStart), "").replace(new RegExp(regexTagEnd), "");
                }

                return "";
            },

            //base method
            transform: function (options) {
                return processors[options.type](options);
            }
        };

    //#endregion

    function transformContent(content, params, dest) {
        var tags = getBuildTags(content),
            config = grunt.config();

        tags.forEach(function (tag) {
            var raw = tag.lines.join(EOL),
                result = "",
                tagFiles = validators.validate(tag, params);

            if (tagFiles) {
                var options = _.extend({}, tag, {
                    data: _.extend({}, config, params.data),
                    files: tagFiles,
                    dest: dest,
                    prefix: params.prefix,
                    relative: params.relative,
                    params: params
                });

                result = processors.transform(options);
            }
            else if (tagFiles === false) {
                grunt.log.warn("Unknown tag detected: '" + tag.type + "'");

                if (!params.allowUnknownTags) {
                    grunt.fail.warn("Use 'parseTag' or 'allowUnknownTags' options to avoid this issue");
                }
            }
            else if (tag.optional) {
                if (params.logOptionals) {
                    grunt.log.warn("Tag with type: '" + tag.type + "' and name: '" + tag.name + "' is not configured in your Gruntfile.js but is set optional, deleting block !");
                }
            }
            else {
                grunt.fail.warn("Tag with type '" + tag.type + "' and name: '" + tag.name + "' is not configured in your Gruntfile.js !");
            }

            content = content.replace(raw, function () { return result });
        });

        if (params.beautify) {
            content = beautify.html(content, _.isObject(params.beautify) ? params.beautify : {});
        }

        return content;
    }

    grunt.registerMultiTask('htmlbuild', "Grunt HTML Builder - Replace scripts and styles, Removes debug parts, append html partials, Template options", function () {
        var params = this.options({
            beautify: false,
            logOptionals: false,
            relative: true,
            scripts: {},
            styles: {},
            sections: {},
            data: {},
            parseTag: 'build',
            processPath: defaultProcessPath
        });

        setTagRegexes(params.parseTag);

        this.files.forEach(function (file) {
            var dest = file.dest || "",
                destPath, content;

            file.src.forEach(function (src) {
                if (params.replace) {
                    destPath = src;
                }
                else if (isFileRegex.test(dest)) {
                    destPath = dest;
                }
                else {
                    destPath = path.join(dest, path.basename(src));
                }

                content = transformContent(grunt.file.read(src), params, dest);

                // write the contents to destination
                grunt.file.write(destPath, content);
                grunt.log.ok("File " + destPath + " created !");
            });
        });
    });
};
