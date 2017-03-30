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
		<!-- build:section recursive views --><!-- /build -->
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

After grunt build process the index.html file will contain files in views and template directories.

### Recursive option

If the __recursive__ option is specified in the tag, __grunt-html-build__ will recursively build every views passed in the section.

Useful to create a main layout file and cut your work in little files.
