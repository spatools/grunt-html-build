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
		<!-- build:remove dev,test -->
		<p class="prod-only"></p>
		<!-- /build -->
	</body>
</html>
```

### Gruntfile.js

```javascript
grunt.initConfig({
    htmlbuild: {
        dist: {
            src: 'index.html',
            dest: 'dist/'
        }
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
		<p class="prod-only"></p>
	</body>
</html>
```

### Per target

Note that __.prod-only__ is part is kept because we configured __remove__ task to remove this part only during __dev__ or __test__ target.
