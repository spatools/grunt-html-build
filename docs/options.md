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

Additionnal Options

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

### options.beautify
 **type :** bool |
 **optional** |
 **default:** false

True to beautify HTML result

### options.prefix
 **type:** string |
 **optional** |

 Add a prefix to destination pathname.  Uses the resolve method from the Node URL library.  

### options.removePrefix
**type:** string |
**optional** |

Remove a prefix to destination pathname.  The method first takes the full source file path, then removes the difference determined by the prefix.  This is useful when running grunt-html-build with ejs files in Express.js.  Note that using removePrefix will override any prefix options.

```javascript
scripts: {
  src: './templates/landing.ejs',
  dest: './views/',
  options: {
      removePrefix: 'public',
      scripts: {
        bundle: [
            './public/js/*.js',
            '!**/main.js',
        ]
    },
}
```
Result:
```html
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/sideBar.js"></script>
```


### options.logOptions
 **type :** bool |
 **optional** |
 **default:** false

Log an alert in console if some optional tags are not rendered
