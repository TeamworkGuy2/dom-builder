TypeScript DOM Builder
==============

Dependencies:
none

TypeScript DOM builder utils.  Makes creating DOM elements and manipulating them in Javascript easier with nearly no performance overhead and transparent, library/helper oriented classes and functions.
Easily switch back and forth between native Javascript DOM code and dom-builder, as simple as:
```ts
var creator = new DomBuilderFactory(window.document);
var div = creator.create('div')
	.addChild(creator.create('span').style('color', 'green'))
	.class(['root-container', 'col-8'])
	.element;
```

Access the underlying DOM elements at any time via the DomBuilder's `.element` property.

`DomBuilderHelper` contains stateless methods for getting and setting element attributes, querying `childNodes`, and adding/removing child nodes.

`dom-builder` also has a simple virtual DOM implementation for use in non-browser environments:
```ts
var DomLite = require('.../DomLite');
var creator = new DomBuilderFactory(new DomLite.DocLike('http://an.xml/namespace/schema', 'root-element'));
// all subsequent creator.create(...) calls return virtual elements, useful for cases like building XLSX/ODF XML documents server side
```


## Examples:
#### Building and appending an element to the DOM using a DomBuilder
```ts
var div = new DomBuilder(window.document.createElement('div'), window.document)
	.style('font-weight', '600')
	.class('cool-button')
	.styles({ width: '200px', height: '120px', background: 'green' }) // add multiple styles at once
	.text('click me!');

window.document.appendChild(div.element);
```

#### DomBuilderFactory simplifies creating DomBuilder elements
```ts
var creator = new DomBuilderFactory(window.document);
var div = creator.create('div')
	.style('textAlign', 'center')
	.text('centered');

window.document.appendChild(div.element);
```

#### Use DomBuilderHelper to manipulate existing elements
```ts
var element = window.document.querySelector(...);

var hlpr = new DomBuilderHelper(window.document);
hlpr.attrInt(element.attributes, 'my-id', 54); // set the 'my-id' attribute of the element

var attrValue = hlpr.attrInt(element.attributes, 'my-id'); // get the 'my-id' attribute from the element and convert it to an integer
console.log('my-id = ' + attrValue + " (" + (typeof attrValue) + ")");
```
