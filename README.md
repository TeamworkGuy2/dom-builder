TypeScript DOM Builder
==============

Dependencies:
none

TypeScript DOM builder utils, as simple as: new DomBuilderFactory(window.document).create('div').style('color', 'green').element;


### Examples:
#### Create a DomBuilder instance
```ts
var div = new DomBuilder(window.document.createElement('div'), window.document)
	.style('font-weight', '600')
	.class('cool-button')
	.styles({ width: '200px', height: '120px', background: 'green' })
	.text('click me!');

window.document.appendChild(div.element);
```

#### Create A DomBuilderFactory to make creating DomBuilder elements easier
```ts
var bldr = new DomBuilderFactory(window.document);
var div = bldr.create('div')
	.style('textAlign', 'center')
	.text('centered');

window.document.appendChild(div.element);
```

#### Use DomBuilderHelepr to help manipulate existing elements
```ts
var element = window.document.querySelector(...);

var hlpr = new DomBuilderHelepr(window.document);
hlpr.attrInt(element.attributes, 'my-id', 54); // set the 'my-id' attribute of the element

var attrValue = hlpr.attrInt(element.attributes, 'my-id'); // get the 'my-id' attribute from the element and convert it to an integer
console.log('my-id = ' + attrValue + " (" + (typeof attrValue) + ")");

```
