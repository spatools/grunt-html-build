# grunt-html-build

## Task Options

grunt-html-build is a multi task grunt plugin, so it's possible to configure differents targets within htmlbuild tag.

### Example

```javascript
grunt.initConfig({
    htmlbuild: {
        dist: {
            src: 'index.html',
            dest: 'samples/',
            options: {
                beautify: true,
                scripts: {
                    bundle: [
                        'scripts/*.js',
                        '!**/main.js',
                    ],
                    main: 'scripts/main.js'
                },
                styles: {
                    bundle: [ 
                        'css/libs.css',
                        'css/dev.css'
                    ],
                    test: 'css/inline.css'
                },
                sections: {
                    views: 'views/**/*.html',
                    templates: 'templates/**/*.html',
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

### src
 **type:** string, array |
 **required**

Specify input files to build. 
Accept globbing patterns

### dest
 **type:** string |
 **optional** |
 **default:** './'

Specify output directory to create results in

### options
 **type:** object |
 **required**

Additional Options

### options.scripts, options.styles, options.sections
 **type:** object |
 **required if there is scripts or styles or sections tags in html**

Object representing files to be inserted into html :

#### Examples:

##### Simple configuration

```javascript
scripts: {
	'name1': '/path/to/file/with/**/globbing.*.ext'
	'name2': [
		'/path/to/file/with/**/globbing.*.ext',
		'!/path/to/file/to/exclude/globbing.*.ext'
	]
}
```
```html
<!-- build:script name1 --><!-- /build -->
<!-- build:script name2 -->
<script type="text/javascript" src="/path/to/static/dev/file.js"></script>
<script type="text/javascript" src="/path/to/static/dev/module.js"></script>
<!-- /build -->
```

##### Advanced configuration

```javascript
scripts: {
	'name1': {
		nocase: true,
		 files: '/path/to/file/with/**/globbing.*.ext'
	},
	'name2': {
		cwd: '/path/to/file',
		files: [
			'with/**/globbing.*.ext',
			'!to/exclude/globbing.*.ext'
		]
	}
}
```
```html
<!-- build:script name1 --><!-- /build -->
<!-- build:script name2 -->
<script type="text/javascript" src="/path/to/static/dev/file.js"></script>
<script type="text/javascript" src="/path/to/static/dev/module.js"></script>
<!-- /build -->
```

### options.prefix
 **type :** string |
 **optional** |
 **default:** null

Append this prefix to all paths in script and style references.

### options.suffix
 **type :** string, function |
 **optional** |
 **default:** null

Append this suffix to to CSS and JS files. Could be a `function(filename, url)` which return a string. The result will be appended to the URL in the form `{url}?{suffix}`

### options.relative
 **type :** string |
 **optional** |
 **default:** true

Make generated path relative to dest path. If this arguments is specified with false value, generated paths will be written as you configure in your Gruntfile.

### options.replace
 **type :** bool |
 **optional** |
 **default:** false

True to replace src file instead of creating a new file.

### options.keepTags
 **type:** boolean |
 **optional** |
 **default:** false

True to keep `htmlbuild` special tags after HTML compilation.

### options.beautify
 **type :** bool |
 **optional** |
 **default:** false

True to beautify HTML result

### options.basePath

**type :** string |
**optional** |
**default:** false

Set to copy the whole folder structure.

```javascript
grunt.initConfig({
    htmlbuild: {
        dev: { // compile with dev options
            src: 'source/app/**/*.html',
            dest: 'tmp/',
            options: {
                basePath: 'source/',
                // destination path = dest + ( src with 'basePath' cut away)
                // sourcefile: 'source/app/customers/customer.html'
                // dest = 'tmp/' +  'app/customers/customer.html'
                // dest = 'tmp/app/customers/customer.html'
            }
        }
    }
)};
```

### options.logOptions
 **type :** bool |
 **optional** |
 **default:** false

Log an alert in console if some optional tags are not rendered

### options.allowUnknownTags
 **type :** bool |
 **optional** |
 **default:** false

Do not fail the task if the parser meet unknown tags. 
Useful when working with `grunt-usemin`.

### options.parseTag
 **type:** string |
 **optional** |
 **default:** 'build'

Specify the html-build tag name, default is 'build'.
Format : <!-- {options.parseTag}:{scripts|styles|sections|process|remove} {name} [attributes] -->

### options.EOL
 **type:** string |
 **optional** |
 **default:** *autodectect*

Force output EOL. If not specified, it will be detected from the input file.


### options.processFiles

**type :** boolean |
**optional** |
**default:** false

Set to true to enable files src configuration replacement.
By enabling it, the following keywords will be replaced in src for each file processed during build:
* `$(filename)`: Current filename (without extension).
* `$(file)`: Current filename (with extension).
* `$(dirname)`: Current directory name.
* `$(path)`: Current file path.
* `$(dir)`: Current directory path.
* `$(platform)`: The result of `process.platform`.