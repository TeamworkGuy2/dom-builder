TypeScript DOM Builder
==============

npm: [`@twg2/dom-builder`](https://www.npmjs.com/package/@twg2/dom-builder)

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
import { DomLite } from '@twg2/dom-builder/dom/DomLite';
var creator = new DomBuilderFactory(new DomLite.DocLike('http://an.xml/namespace/schema', 'root-element'));
// creator.create(...) will return virtual elements, useful for cases like building XLSX/ODF XML documents in Node.js
```

#### JSDOM virtual DOM
[JSDOM](https://github.com/jsdom/jsdom) is a feature full virtual DOM implementation in non-browser environments:
```ts
import * as JSDom from "jsdom";

const dom = new JSDom.JSDOM("<?xml version=\"1.0\"?><root ...></root>", { contentType: "text/xml" }).window.document;
```

You can also override [`DomBuilderHelper`](dom/DomBuilderHelper.ts) `getParser()` and `getSerializer()` to use JSDOM like this:
```ts
DomBuilderHelper.setParser({
  parseFromString: (html, type) => {
    const jsdom = new JSDom.JSDOM(html, { contentType: type || "text/xml" });
    return jsdom.window.document;
  }
});

DomBuilderHelper.setSerializer({
  serializeToString: (root) => {
    return root.documentElement.outerHTML;
  }
});
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

#### JSDOM to create and serialize XML
```ts
var xmlnsUri = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
var doc = new JSDom.JSDOM(
  `<?xml version="1.0"?>\n<sst xmlns="${xmlnsUri}"></sst>`,
  { contentType: "text/xml" }
).window.document;
var elem = doc.createElementNS(xmlnsUri, 's');
doc.documentElement.appendChild(elem);
console.log(doc.documentElement.outerHTML);
```

Result
```xml
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><s/></sst>
```

#### Browser DOMParser and XMLSerializer to create and serialize XML
```ts
var xmlnsUri = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
var doc = new DOMParser().parseFromString(`<?xml version="1.0"?>\n<sst xmlns="${xmlnsUri}"></sst>`, "application/xml")
var elem = doc.createElementNS(xmlnsUri, 's');
doc.documentElement.appendChild(elem);
var xmlStr = new XMLSerializer().serializeToString(doc);
console.log(xmlStr);
```

Result
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><s/></sst>
```
