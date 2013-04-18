# grunt-html-build

## Using HTML as Template

When using grunt-html-build, you can make some parts of HTML files to be processed as grunt template.
You can use values from config and from htmlbuild's option's data as globals.

### index.html

```html
<html>
	<head>
		<!-- build:process -->
		<title><%= pkg.name %></title>
		<!-- /build -->
		...
	</head>
	<body>
		<p>No process here</p>
		<p><%= noprocess %></p>
		<!-- build:process -->
		<script type="text/javascript" src="/path/to/debug/lib1.js">
			var version = "<%= pkg.version %>",
				baseUrl = "<%= baseUrl %>";
		</script>
		<!-- /build -->
	</body>
</html>
```

### Gruntfile.js

```javascript
grunt.initConfig({
	pkg = grunt.file.readJSON("package.json"),

    htmlbuild: {
        src: 'index.html',
        dest: 'dist/',
        options: {
            data: {
				baseUrl: "http://my.prod.site.com/"
			}
        }
    }
});
```

### Result

```html
<html>
	<head>
		<title>YourPackageName</title>
		...
	</head>
	<body>
		<p>No process here</p>
		<p><%= noprocess %></p>
		<!-- build:script libs -->
		<script type="text/javascript" src="/path/to/debug/lib1.js">
			var version = "1.0.0",
				baseUrl = "http://my.prod.site.com/";
		</script>
		<!-- /build -->
	</body>
</html>
```

