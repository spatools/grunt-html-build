grunt-html-build
================

[Grunt][grunt] HTML Builder - Appends scripts and styles, Removes debug parts, append html partials, Template options

## Getting Started

Install this grunt plugin next to your project's gruntfile with: `npm install grunt-html-build --save-dev`

Then add this line to your project's `Gruntfile.js` :

```javascript
grunt.loadNpmTasks('grunt-html-build');
```

Then specify your config:

```javascript
	grunt.initConfig({
		htmlbuild: {
			dist: {
				src: './index.html',
				dest: './dist/',
				options: {
					scripts: {
						bundle: 'scripts/*.js',
					},
					styles: {
						bundle: 'styles/*.css',
						test: 'inline.css'
					},
					sections: {
						views: 'views/**/*.html',
						templates: 'templates/**/*.html',
					},
					data: {
						version: "0.1.0",
						test: "test",
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
    <!-- build:section views -->
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

    <!-- build:section templates -->
    <!-- /build -->
</body>
</html>
```

After running the grunt task it will be stored on the dist folder as

```html
<!DOCTYPE html>
<html>
<head>
    <title>grunt-html-build - Test Page</title>
    <link rel="stylesheet" type="text/css" href="styles/libs.css" />
    <link rel="stylesheet" type="text/css" href="styles/app.css" />
    <style> ... CSS content from inline.css ... </style>
</head>
<body id="landing-page">
    <div id="view1"> ... </div>
    <div id="view2"> ... </div>
    <div id="view3"> ... </div>
	<!-- ... -->

    <script type="text/javascript" src="scripts/libs.js"></script>
    <script type="text/javascript" src="scripts/app.js"></script>
    <script type="text/javascript" src="scripts/main.js"></script>

    <script id="template1" type="text/html"> ... </script>
    <script id="template2" type="text/html"> ... </script>
    <script id="template3" type="text/html"> ... </script>
	<!-- ... -->
</body>
</html>
```

There 5 types of processors: 
 * script    (append script reference from configuration to dest file)
 * style    (append style reference from configuration to dest file)
 * section    (append partials from configuration to dest file)    
 * process    (process grunt template on the block)   
 * remove    (it will erase the whole block).

[grunt]: https://github.com/gruntjs/grunt

## Release History
* 0.1.0 Initial Release