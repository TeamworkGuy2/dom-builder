TypeScript DOM Builder
==============

Dependencies:
none

Create and manipulate DOM elements in TypeScript easily with minimal performance overhead.
Classes are transparent, helper oriented, with easy access to the underlying DOM elements.
Easily switch between native Javascript DOM code and `dom-builder`, as simple as:
```ts
var creator = new DomBuilderFactory(window.document);
var div = creator.create('div')
	.addChild(creator.create('span').style('color', 'green').text('Hello World'))
	.classes(['root-container', 'col-8'])
	.element; // access the underlying DOM element at any point via the 'element' property
```

`DomBuilderHelper` contains stateless methods for getting and setting element attributes, querying `children` and `childNodes`, and adding/removing child nodes.

#### `dom-builder` has a simple virtual DOM implementation for use in non-browser environments:
```ts
var DomLite = require('.../DomLite');
var creator = new DomBuilderFactory(new DomLite.DocLike('http://an.xml/namespace/schema', 'root-element'));
// creator.create(...) will return virtual elements, useful for cases like building XLSX/ODF XML documents server side
```


## Examples:
#### Build and append an element to the DOM using a DomBuilder
```ts
var div = new DomBuilder(window.document.createElement('div'), window.document)
	.style('font-weight', '600')
	.classes('cool-button')
	.styles({ width: '200px', height: '120px', background: 'green' }) // add multiple styles at once
	.text('click me!');

window.document.appendChild(div.element);
```

#### DomBuilderFactory - simplified element creation
```ts
var creator = new DomBuilderFactory(window.document);
var div = creator.create('div')
	.style('textAlign', 'center')
	.text('centered');

window.document.appendChild(div.element);
```

#### DomBuilderHelper - manipulating existing elements
```ts
var element = window.document.querySelector(...);
var helper = new DomBuilderHelper(window.document);

helper.attrInt(element.attributes, 'my-id', 54); // set the 'my-id' attribute of the element

var attrValue = helper.attrInt(element.attributes, 'my-id'); // get the 'my-id' attribute from the element and convert it to an integer
console.log('my-id = ' + attrValue + " (" + (typeof attrValue) + ")");
// > my-id = 54 (number)
```
