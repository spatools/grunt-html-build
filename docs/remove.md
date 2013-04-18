# grunt-html-build

## Removing parts

When using grunt-html-build, you can generate a HTML page which remove some dev parts.

### index.html

```html
<html>
	<head>
		...
	</head>
	<body>
		<div> ... </div>
		<p> ... </p>
		<!-- build:remove -->
		<p class="debug-only"></p>
		<input type="text" id="test" />
		<!-- /build -->
	</body>
</html>
```

### Gruntfile.js

```javascript
grunt.initConfig({
    htmlbuild: {
        src: 'index.html',
        dest: 'dist/'
    }
});
```

### Result

```html
<html>
	<head>
		...
	</head>
	<body>
		<div> ... </div>
		<p> ... </p>
	</body>
</html>
```

