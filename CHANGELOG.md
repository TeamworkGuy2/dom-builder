# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.5.0](N/A) - 2017-11-16
#### Changed
* `package.json` added `strictNullChecks` and fixed code to handle nullable types
* added/improved unit tests


--------
### [0.4.1](https://github.com/TeamworkGuy2/dom-builder/commit/fe4375294e67a993919e9bd6dcc26b915dd7aa97) - 2017-08-11
#### Changed
* Update to TypeScript 2.4


--------
### [0.4.0](https://github.com/TeamworkGuy2/dom-builder/commit/9a7ccbc07d374fce3d5960770263b53fba22e315) - 2017-07-12
#### Changed
* Renamed DomBuilder.class() to classes() (meant to include in 0.3.0)


--------
### [0.3.0](https://github.com/TeamworkGuy2/dom-builder/commit/75b6e20e3f490ac81e085986b3946f79a58d0dd5) - 2017-07-12
#### Added
* DomLite a very basic virtual DOM implementation, currently only partially implements 'id', 'nodeName', 'attribute', 'childNodes', 'classList', and 'style' Element properties.  The bare minimum needed to meet the needs of libraries like [xlsx-spec-utils](https://github.com/TeamworkGuy2/xlsx-spec-utils) and [xlsx-spec-models](https://github.com/TeamworkGuy2/xlsx-spec-models).
* Added first unit tests for DomLite and DomBuilderHelper using chai & mocha
* Updated README

#### Changed
* Extensive dom-builder interface changes
* Nearly all DOM types like Node, Element, and HTMLElement have been replaced with '-Like' interfaces such as `DocumentLike` and `ElementLike`
* DomBuilder class now takes two generic parameters, the element type and document type
* DomBuilderFactory.newLink takes a 'doc' parameter
* DomBuilderHelper.getNodeAttr*() methods 'ifNullReturnNull' parameter changed to 'defaultValue'; i.e. signature looks like getNodeAttrInt(elem, attrName, [defaultValue])

#### Fixed
* DomBuilderHelper.getNodeAttrBool() not parsing false attributes properly


--------
### [0.2.1](https://github.com/TeamworkGuy2/dom-builder/commit/1398109ec0265d5f460ae0b022e646c905e3f430) - 2017-05-08
#### Changed
* Expanded DomBuilderFactory.create() to use HTMLElementTagNameMap for all HTML element types/names
* DomBuilder.addChild() now supports adding DomBuilders in addition to HTML elements


--------
### [0.2.0](https://github.com/TeamworkGuy2/dom-builder/commit/2870cc4ee9f8c272827ca485fe2a0a9515475efc) - 2017-01-28
#### Changed
* Added method expectNode() to DomValidate interface
* DomBuilder internal changes to make extending it easier


--------
### [0.1.1](https://github.com/TeamworkGuy2/dom-builder/commit/79abd5e028f5c71ede33924428d3df2755a6d871) - 2016-12-30
#### Changed
* TypeScript 2.0 compatibility


--------
### [0.1.0](https://github.com/TeamworkGuy2/dom-builder/commit/a584d1cb374e5f33018f13c06c950a45415b8068) - 2016-04-28
#### Added
Initial code commit, included in /dom/ directory:
* dom-builder.d.ts - interfaces for this module
* DomBuilder.ts - the main DOM builder API, wraps and element (accessible vial the 'element' property) and provides helper functions like class(), style(), attrs(), etc. to setup an element
* DomBuilderFactory.ts - a factory that wraps a 'Document' object (i.e. window.document) and provides a quick create() function instead manually creating DomBuilder instances
* DomBuilderHelper.ts - a helper that wraps a 'Document' object and provides functions like attrFloat(), attrString(), queryAllChilds() and removeChilds()

#### Changed
* Renamed project from ts-dom-builder -> dom-builder