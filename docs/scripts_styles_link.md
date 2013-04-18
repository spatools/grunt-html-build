# grunt-html-build

## Linking Scripts and Styles

When using grunt-html-build, you can generate a HTML page which replace debug scripts and style links by production ones.

Let's take an application directory like this :

 * app
    * module1.js 
    * module2.js 
 * libs
    * lib1.html 
    * lib2.html 
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
		<!-- build:style inline app -->
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
		<!-- build:script inline main -->
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
Moreover, some tags have the argument *inline* specified. It specify that this tags must render the content of files directly in the result HTML

```html
<html>
	<head>
		<link type="text/css" rel="stylesheet" href="css/lib1.css" />
		<link type="text/css" rel="stylesheet" href="css/lib2.css" />
		<style>
			.content-of-app.css {}
		</style>
	</head>
	<body>
		<script type="text/javascript" src="libs/lib1.js"></script>
		<script type="text/javascript" src="libs/lib2.js"></script>
		<script type="text/javascript" src="app/module1.js"></script>
		<script type="text/javascript" src="app/module2.js"></script>
		<script type="text/javascript">
			// content of main.js
		</script>
	</body>
</html>
```

