# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [1.0.0](https://github.com/TeamworkGuy2/dom-builder/releases/tag/v1.0.0) - 2025-07-25
#### Changed
Time to mark this package stable and v1!

* BREAKING: update exports to use standard named exports rather than a default export object. This requires updating import statements from `import DomBuilderHelper from '@twg2/dom-builder/DomBuilderHelper';` to `import { DomBuilderHelper } from '@twg2/dom-builder/DomBuilderHelper';`, notice the parenthesis now required around the import type.
* Add `namespaceURI` property to attributes and elements with logic to automatically detect namespaces
* Update to TypeScript 4.9


--------
### [0.11.0](https://github.com/TeamworkGuy2/dom-builder/releases/tag/v0.11.0) - 2022-01-02
#### Changed
* Update to TypeScript 4.4


--------
### [0.10.0](https://github.com/TeamworkGuy2/dom-builder/commit/88405417bbf4352ccfbcd9823086abe4fbdcf8d2) - 2021-06-12
#### Changed
* Update to TypeScript 4.3


--------
### [0.9.0](https://github.com/TeamworkGuy2/dom-builder/commit/34a68dc98a7c090545d4a953818819bb5d855312) - 2021-01-01
#### Added
* BREAKING: Added `DomValidate.missingAttribute()` interface method - implementations will need to add this
* A lot of `dom-builder.d.ts` documentation for `DomBuilderHelper`
* Added optional 'parent' argument to `DomValidate.missingNode()`
* `NodeLike.removeChild()`
* DomLite `ElemLite` now implements `firstChild`, `lastChild`, and `removeChild()`

#### Changed
* `BuilderHelper` interface changes and `DomBuilderHelper` implementation changes:
  * BREAKING: `getChilds()` split and renamed into `getChildren()` and `getChildNodes()`
  * BREAKING: `getNodeAttrs()` renamed `getAttrs()`
  * BREAKING: `removeNodeAttr()` renamed `removeAttr()`
  * BREAKING: `getNodeAttr*[Int|Float|Bool|String]()` methods renamed `getAttr*()` (i.e. `getNodeAttrInt()` is now `getAttrInt()`)
  * Simplify `getAttrs()` overload signature
  * `attr*()` and `getAttr*()` methods have a new optional `throwIfMissing` argument
  * `queryOneChild()` now correctly returns `T | null`
  * `addChilds()` and `removeChilds()` expanded to accept `NodeLike` and `Node` instead of `ElementLike` and `Element`
* `DomBuilder` `element` is no longer a getter but a public field, can be set. Since `DomBuilder` has no other internal state besides `dom`, changing the `element` value should be safe.


--------
### [0.8.0](https://github.com/TeamworkGuy2/dom-builder/commit/64f8dcbc30e4a1dec5842e0dcdcb7e89d9e0d86c) - 2020-09-04
#### Changed
* Update to TypeScript 4.0


--------
### [0.7.2](https://github.com/TeamworkGuy2/dom-builder/commit/4c08f0bccfda49ee098164e7143adb19d5ffed8f) - 2019-11-08
#### Changed
* Update to TypeScript 3.7


--------
### [0.7.1](https://github.com/TeamworkGuy2/dom-builder/commit/f0e6dda3ebbdb97d925588ec5ffa89d0af96c1a9) - 2019-07-05
#### Changed
* Update to TypeScript 3.5 and fixed missing lib.dom.d.ts NodeSelector type


--------
### [0.7.0](https://github.com/TeamworkGuy2/dom-builder/commit/9650a03b3bfdfdeb844bf39a185bdcf8056fff00) - 2019-05-24
#### Added
* ElementLike `setAttribute()` and `setAttributeNS()`

#### Changed
* DomBuilderHelper `attr*()` functions first parameter changed from `attrs: NamedNodeMap` to `elem: ElementLike` to allow setAttribute() to be used instead of setNamedItem() (setNamedItem() does not preserve the namespace prefix in some DOM implementations)


--------
### [0.6.5](https://github.com/TeamworkGuy2/dom-builder/commit/fbb4c44b7195fddd89274e23eba2e6fd9e1248ce) - 2019-05-24
#### Fixed
* Fix attribute creation to use createAttributeNS() for attribute names containing a namespace prefix followed by `:`


--------
### [0.6.4](https://github.com/TeamworkGuy2/dom-builder/commit/55910566c332d22711d2d524c87d49c12c8d2eb2) - 2018-12-29
#### Changed
* Update to TypeScript 3.2 and fix compile errors
* Update @types dependencies


--------
### [0.6.3](https://github.com/TeamworkGuy2/dom-builder/commit/0ed836c7bf54d8989d3165f9f744c0513bf6b786) - 2018-10-16
#### Changed
* Update to TypeScript 3.1
* Update dev dependencies and @types
* Enable `tsconfig.json` `strict` and fix compile errors
* Removed compiled bin tarball in favor of git tags


--------
### [0.6.2](https://github.com/TeamworkGuy2/dom-builder/commit/d34a61c4ba58e831c134b04b065a9507a73156a9) - 2018-04-08
#### Changed
* Added tarball and package.json npm script `build-package` reference for creating tarball


--------
### [0.6.1](https://github.com/TeamworkGuy2/dom-builder/commit/91ce390d6022843b95f1f817c3a2ab51d51084e3) - 2018-03-31
#### Changed
* Update tsconfig.json with `noImplicitReturns: true` and `forceConsistentCasingInFileNames: true`


--------
### [0.6.0](https://github.com/TeamworkGuy2/dom-builder/commit/37fc735038e69b9562d2d3e9766e521d87dee4f7) - 2018-03-29
#### Changed
* Update to TypeScript 2.8 and fixes for Element and Document to be assignable to ElementLike and DocumentLike


--------
### [0.5.2](https://github.com/TeamworkGuy2/dom-builder/commit/0ee1f9a03c3e8f7d98103193c4a1eb574c40ae86) - 2018-02-27
#### Changed
* Update to TypeScript 2.7


--------
### [0.5.1](https://github.com/TeamworkGuy2/dom-builder/commit/ef5d34eb0c31be8bb67329f58b53a28c02168e38) - 2018-02-11
#### Changed
* Update `package.json` dependencies - update chai, mocha, and node


--------
### [0.5.0](https://github.com/TeamworkGuy2/dom-builder/commit/496d057345a7d79e6f05919c2be0c91ceca53985) - 2017-11-16
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