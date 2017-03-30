# grunt-html-build

## Linking Scripts and Styles

When using grunt-html-build, you can generate a HTML page which replace debug scripts and style links by production ones.

Let's take an application directory like this :

 * app
    * module1.js 
    * module2.js 
 * libs
    * lib1.js 
    * lib2.js 
 * css
    * lib1.css 
    * lib2.css 
    * app.css 
 * main.js 
 * index.html


### index.html

```html
<html>
	<head>
		<!-- build:style libs -->
		<link type="text/css" rel="stylesheet" href="/path/to/debug/lib1.css" />
		<link type="text/css" rel="stylesheet" href="/path/to/debug/lib2.css" />
		<!-- /build -->
		<!-- build:style inline app [media="screen and (max-width: 480px)"] -->
		<link type="text/css" rel="stylesheet" href="/path/to/debug/app.css" />
		<!-- /build -->
	</head>
	<body>
		<!-- build:script libs -->
		<script type="text/javascript" src="/path/to/debug/lib1.js"></script>
		<script type="text/javascript" src="/path/to/debug/lib2.js"></script>
		<!-- /build -->
		<!-- build:script app -->
		<script type="text/javascript" src="/path/to/debug/module1.js"></script>
		<script type="text/javascript" src="/path/to/debug/module2.js"></script>
		<!-- /build -->
		<!-- build:script main [defer] -->
		<!-- /build -->
		<!-- build:script inline main -->
		<script type="text/javascript">
			start();
		</script>
		<!-- /build -->
                <!-- build:script inline noprocess main -->
		<script type="text/javascript">
			start();
		</script>
		<!-- /build -->

	</body>
</html>
```

### Gruntfile.js

```javascript
grunt.initConfig({
    htmlbuild: {
        src: 'index.html',
        dest: 'dist/',
        options: {
            scripts: {
                libs: 'libs/*.js',
				app: 'app/*.js',
                main: 'main.js'
            },
            styles: {
                libs: [ 
                    'css/lib1.css',
                    'css/lib2.css'
                ],
                app: 'css/app.css'
            }
        }
    }
});
```

### Result

After grunt build, created index.html will contains links to files specified in options.

```html
<html>
	<head>
		<link type="text/css" rel="stylesheet" href="css/lib1.css" />
		<link type="text/css" rel="stylesheet" href="css/lib2.css" />
		<style media="screen and (max-width: 480px)">
			.content-of-app.css {}
		</style>
	</head>
	<body>
		<script type="text/javascript" src="libs/lib1.js"></script>
		<script type="text/javascript" src="libs/lib2.js"></script>
		<script type="text/javascript" src="app/module1.js"></script>
		<script type="text/javascript" src="app/module2.js"></script>
		<script type="text/javascript" src="app/main.js" defer></script>
		<script type="text/javascript">
			// content of main.js
		</script>
		<script type="text/javascript">
			// content of main.js without underscore templating.
                        // <%= %> tags will not be parsed.
                        // Useful when trying to include inlined version of lodash or underscore
		</script>
	</body>
</html>
```

### Tag options

* __optional__: Specifies that the tag can be omited from configuration. If not specified and no configuration exists for this particular tag. The task will fail.
* __inline__: Specifies that the tag must render the content of files directly in the resulting HTML.
* __noprocess__: Specifies that the tag content must not be processed by grunt.js templating engine. Must be used with __inline__.
* __[attributes]__: Specifies attributes that will be added to the resultings tags.
