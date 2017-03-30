# grunt-html-build

## Creating reusable HTML Layout Template

When using grunt-html-build, you can reuse same HTML layout template between multiple projects. 
But when creating reusable HTML layout template, you must take care of some things :

 1. Think of features you need en each project
    * Custom Title
	* Styles
	* Scripts
	* Views
	* Templates
 2. Use optional attribute on optional tags
	* Prevent grunt from fail when no match is found for a tag in the config
	* Use it precautially, it prevents some errors, in a project, some parts are require, some are optional
 3. Think reuse
	* Create some optional sections to help customize layout between projects

### index.html

```html
<html>
	<head>
		<!-- build:process -->
		<title><%= pkg.name %></title>
		<!-- /build -->
		<!-- build:style optional libs --><!-- /build -->
		<!-- build:style app --><!-- /build -->

		<!-- build:section optional headers --><!-- /build -->
	</head>
	<body>
		<!-- build:section optional body_start --><!-- /build -->

		<!-- build:section views --><!-- /build -->
		<!-- build:section optional templates --><!-- /build -->

		<!-- build:script optional libs --><!-- /build -->
		<!-- build:script app --><!-- /build -->
		<!-- build:script main --><!-- /build -->

		<!-- build:section optional body_end --><!-- /build -->
	</body>
</html>
```
