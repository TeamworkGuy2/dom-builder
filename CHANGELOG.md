# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.1.1](N/A) - 2016-12-30
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