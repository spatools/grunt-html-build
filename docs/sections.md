# grunt-html-build

## Creating HTML Sections

When using grunt-html-build, you can generate a HTML page using many input files.

Let's take an application directory like this :

 * views
    * view1.html 
    * view2.html 
 * templates
    * tmpl1.html 
    * tmpl2.html 
 * index.html


### index.html

```html
<html>
	<head>
		...
	</head>
	<body>
		<!-- build:section views --><!-- /build -->
		<!-- build:section templates --><!-- /build -->
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
            sections: {
                views: 'views/**/*.html',
                templates: 'templates/**/*.html',
            }
        }
    }
});
```

After grunt build, created index.html will contains any files in views and tmpl directories.

Useful to create a main layout file and cut your work in little files.
