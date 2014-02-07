# grunt-html-build [![NPM version](https://badge.fury.io/js/grunt-html-build.png)](http://badge.fury.io/js/grunt-html-build)

[Grunt][grunt] HTML Builder - Appends scripts and styles, Removes debug parts, append html partials, Template options

## Getting Started

Install this grunt plugin next to your project's gruntfile with: `npm install grunt-html-build --save-dev`

Then add this line to your project's `Gruntfile.js` :

```javascript
grunt.loadNpmTasks('grunt-html-build');
```

Then specify your config: ([more informations][doc-options])

```javascript
grunt.initConfig({
    fixturesPath: "fixtures",

    htmlbuild: {
        dist: {
            src: 'index.html',
            dest: 'samples/',
            options: {
                beautify: true,
                prefix: '//some-cdn',
				relative: true,
                scripts: {
                    bundle: [
                        '<%= fixturesPath %>/scripts/*.js',
                        '!**/main.js',
                    ],
                    main: '<%= fixturesPath %>/scripts/main.js'
                },
                styles: {
                    bundle: [
                        '<%= fixturesPath %>/css/libs.css',
                        '<%= fixturesPath %>/css/dev.css'
                    ],
                    test: '<%= fixturesPath %>/css/inline.css'
                },
                sections: {
                    views: '<%= fixturesPath %>/views/**/*.html',
                    templates: '<%= fixturesPath %>/templates/**/*.html',
					layout: {
						header: '<%= fixturesPath %>/layout/header.html',
						footer: '<%= fixturesPath %>/layout/footer.html'
					}
                },
                data: {
					// Data to pass to templates
                    version: "0.1.0",
                    title: "test",
                },
            }
        }
    }
});
```

Using the configuration above, consider the following example html to see it in action:

```html
<html>
<head>
    <title>grunt-html-build - Test Page</title>
    <!-- build:style bundle -->
    <link rel="stylesheet" type="text/css" href="/path/to/css/dev.css" />
    <!-- /build -->
    <!-- build:style inline test -->
    <link rel="stylesheet" type="text/css" href="/path/to/css/dev-inline.css" />
    <!-- /build -->
</head>
<body id="landing-page">
	<!-- build:section layout.header -->
	<!-- /build -->

    <!-- build:section views -->
    <!-- /build -->

	<!-- build:section layout.footer -->
	<!-- /build -->

    <!-- build:remove -->
    <script type="text/javascript" src="/path/to/js/only-dev.js"></script>
    <!-- /build -->

    <!-- build:script bundle -->
    <script type="text/javascript" src="/path/to/js/libs/jquery.js"></script>
    <script type="text/javascript" src="/path/to/js/libs/knockout.js"></script>
    <script type="text/javascript" src="/path/to/js/libs/underscore.js"></script>
    <script type="text/javascript" src="/path/to/js/app/module1.js"></script>
    <script type="text/javascript" src="/path/to/js/app/module2.js"></script>
    <!-- /build -->
    <!-- build:process -->
    <script type="text/javascript">
        var version = "<%= version %>",
            title = "<%= title %>";
    </script>
    <!-- /build -->
    <!-- build:script inline main -->
    <script type="text/javascript">
        main();
    </script>
    <!-- /build -->

    <!-- build:section optional test -->
    <!-- /build -->
</body>
</html>
```

After running the grunt task it will be stored on the dist folder as

```html
<html>
    <head>
        <title>grunt-html-build - Test Page</title>
        <link type="text/css" rel="stylesheet" href="../fixtures/css/libs.css" />
        <link type="text/css" rel="stylesheet" href="../fixtures/css/dev.css" />
        <style>
            .this-is-inline {
                font-weight: bold;
            }
        </style>
    </head>
    <body id="landing-page">
		<header>...</header>
        <div id="view1">...</div>
        <div id="view2">...</div>
        <div id="view3">...</div>
		<footer>...</footer>
        <script type="text/javascript" src="../fixtures/scripts/app.js"></script>
        <script type="text/javascript" src="../fixtures/scripts/libs.js"></script>
        <script type="text/javascript">
            var version = "0.1.0",
                title = "test";
        </script>
        <script type="text/javascript">
            productionMain();
        </script>
    </body>
</html>
```

There 5 types of processors:

 * [script][doc-scripts-styles]
	* append script reference from configuration to dest file.
 * [style][doc-scripts-styles]
	* append style reference from configuration to dest file.
 * [section][doc-sections]
	* append partials from configuration to dest file.
 * [process][doc-process]
	* process grunt template on the block.
 * [remove][doc-remove]
	* it will erase the whole block.

[grunt]: https://github.com/gruntjs/grunt
[doc-options]: https://github.com/spatools/grunt-html-build/wiki/Task-Options
[doc-scripts-styles]: https://github.com/spatools/grunt-html-build/wiki/Linking-Scripts-and-Styles
[doc-sections]: https://github.com/spatools/grunt-html-build/wiki/Creating-HTML-Sections
[doc-process]: https://github.com/spatools/grunt-html-build/wiki/Using-HTML-as-Template
[doc-remove]: https://github.com/spatools/grunt-html-build/wiki/Removing-parts
[doc-reuse]: https://github.com/spatools/grunt-html-build/wiki/Creating-reusable-HTML-Layout-Template

## Release History
* 0.1.0 Initial Release
* 0.1.1 Cleaning, adding optional tags, using js-beautify
* 0.1.2 Adding expand options to tags paths and write docs
* 0.1.3 Fixing nodejs dependencies
* 0.1.4 Fixing nodejs dependencies
* 0.1.5 Optimize src loop / Fix js-beautify options
* 0.1.6 Allow build tag customization
* 0.2.0 
	* Fix and optimisation
	* Allow replacing src file by built file
	* Allow filename in dest path
	* Allow prefixing src files
* 0.2.1 Allow non relative file names + per file tag parameter
* 0.2.2 Fix issue in options.relative
* 0.3.0
	* Fix issue when building multiple html files using custom file globbing
	* Allow sub parameters in all options paths
* 0.3.1
	* Fix issue when using prefix on Windows environment
* 0.3.2
	* Update js-beautify dependency to 1.4.2
	* Remove peerDependencies to avoid versions conflict
