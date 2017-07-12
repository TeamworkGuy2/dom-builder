"use strict";
var DomLite;
(function (DomLite) {
    var EMPTY_LIST = Object.freeze(createNodeList());
    function createElement(qualifiedName) {
        return new ElemLike(qualifiedName, null);
    }
    DomLite.createElement = createElement;
    function createTextNode(data) {
        return new TextNodeLike(data);
    }
    DomLite.createTextNode = createTextNode;
    function createAttribute(qualifiedName, value, namespaceUri) {
        return new AttrLike(qualifiedName, value, namespaceUri);
    }
    DomLite.createAttribute = createAttribute;
    var AttrLike = (function () {
        function AttrLike(qualifiedName, value, namespaceUri) {
            this.name = qualifiedName;
            this.value = "" + value;
            this.ns = namespaceUri || null;
        }
        return AttrLike;
    }());
    DomLite.AttrLike = AttrLike;
    var DocLike = (function () {
        function DocLike(ns, rootNodeName) {
            this.doc = this.createElement(rootNodeName);
            if (ns != null) {
                this.doc.attributes.setNamedItem({ name: "xmlns", value: ns });
            }
        }
        DocLike.prototype.createAttribute = function (name) {
            return new AttrLike(name, null, null);
        };
        DocLike.prototype.createAttributeNS = function (namespaceUri, qualifiedName) {
            return new AttrLike(qualifiedName, null, namespaceUri);
        };
        DocLike.prototype.createElement = function (qualifiedName) {
            return new ElemLike(qualifiedName, null);
        };
        DocLike.prototype.createElementNS = function (namespaceUri, qualifiedName) {
            return new ElemLike(qualifiedName, namespaceUri);
        };
        DocLike.prototype.createTextNode = function (data) {
            var inst = new ElemLike(null, null);
            inst.nodeValue = data;
            return inst;
        };
        DocLike.prototype.toString = function () {
            return this.doc.toString();
        };
        return DocLike;
    }());
    DomLite.DocLike = DocLike;
    var ElemLike = (function () {
        function ElemLike(qualifiedName, namespaceUri) {
            this.nodeName = qualifiedName;
        }
        Object.defineProperty(ElemLike.prototype, "attributes", {
            get: function () {
                return this._attributes || (this._attributes = createNamedNodeMap());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElemLike.prototype, "childNodes", {
            get: function () {
                return this._childNodes || (this._childNodes = createNodeList());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElemLike.prototype, "classList", {
            get: function () {
                return this._classList || (this._classList = createDomTokenList());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElemLike.prototype, "style", {
            get: function () {
                return this._style || (this._style = createCssStyle());
            },
            enumerable: true,
            configurable: true
        });
        ElemLike.prototype.appendChild = function (newChild) {
            this._childNodes = this._childNodes || createNodeList();
            this._childNodes.push(newChild);
            return newChild;
        };
        ElemLike.prototype.addEventListener = function (type, listener, options) {
            // do nothing
        };
        ElemLike.prototype.toString = function (indent, currentIndent) {
            var str = (currentIndent || "") + "<" + this.nodeName;
            var attrs = (this._attributes != null ? [] : null);
            for (var i = 0, size = this._attributes != null ? this._attributes.length : 0; i < size; i++) {
                var attr = this._attributes[i];
                attrs.push(attr.name + "=\"" + attr.value + "\"");
            }
            str += (attrs != null && attrs.length > 0 ? " " + attrs.join(" ") : "");
            var hasText = this.textContent != null && this.textContent.length > 0;
            size = this._childNodes != null ? this._childNodes.length : 0;
            str += (!hasText && size < 1 ? " />" : (">" + (hasText ? this.textContent : "")));
            for (var i = 0; i < size; i++) {
                str += (indent != null ? "\n" : "") + this._childNodes[i].toString(indent, (indent != null ? (currentIndent ? currentIndent + indent : indent) : null));
            }
            if (hasText || size > 0) {
                if (indent != null && size > 0) {
                    str += "\n" + (currentIndent || "");
                }
                str += "</" + this.nodeName + ">";
            }
            return str;
        };
        ElemLike.prototype.cloneNode = function (deep) {
            var copy = new ElemLike(this.nodeName, null);
            copy.id = this.id;
            copy.nodeValue = this.nodeValue;
            copy.textContent = this.textContent;
            copy._attributes = (deep && this._attributes != null ? createNamedNodeMap(this._attributes) : null);
            copy._childNodes = (deep && this._childNodes != null ? createNodeList(this._childNodes, deep) : null);
            copy._classList = (deep && this._classList != null ? createDomTokenList(this._classList) : null);
            copy._style = (deep && this._style != null ? createCssStyle(this._style) : null);
            return copy;
        };
        return ElemLike;
    }());
    DomLite.ElemLike = ElemLike;
    var TextNodeLike = (function () {
        function TextNodeLike(data) {
            this.attributes = null;
            this.childNodes = EMPTY_LIST;
            this.nodeName = "#text";
            this.nodeValue = data;
        }
        TextNodeLike.prototype.appendChild = function (newChild) {
            throw new Error("Child nodes cannot be appended to a Text node");
        };
        TextNodeLike.prototype.addEventListener = function (type, listener, options) {
            // do nothing
        };
        TextNodeLike.prototype.toString = function () {
            return this.nodeValue;
        };
        TextNodeLike.prototype.cloneNode = function (deep) {
            return new TextNodeLike(this.nodeValue);
        };
        return TextNodeLike;
    }());
    DomLite.TextNodeLike = TextNodeLike;
    function createCssStyle(copy) {
        var inst = (copy != null ? Object.assign({}, copy) : {});
        inst.getPropertyPriority = function getPropertyPriority(propertyName) {
            // TODO ignores priority
            return "";
        };
        inst.getPropertyValue = function getPropertyValue(propertyName) {
            return inst[propertyName];
        };
        inst.item = function item(index) {
            // TODO efficient
            var keys = Object.keys(inst);
            return inst[keys[index]];
        };
        inst.removeProperty = function removeProperty(propertyName) {
            var oldVal = inst[propertyName];
            delete inst[propertyName];
            return oldVal;
        };
        inst.setProperty = function setProperty(propertyName, value, priority) {
            // TODO ignores priority parameter
            inst[propertyName] = value;
        };
        return inst;
    }
    DomLite.createCssStyle = createCssStyle;
    function createNamedNodeMap(copy) {
        var inst = [];
        if (copy != null) {
            for (var k = 0, sz = copy.length; k < sz; k++) {
                inst.push({ name: copy[k].name, value: copy[k].value });
            }
        }
        inst.getNamedItem = function getNamedItem(name) {
            return inst.find(function (attr) { return attr.name === name; }) || null;
        };
        inst.getNamedItemNS = function getNamedItemNS(namespaceURI, localName) {
            return inst.find(function (attr) { return attr.name === localName; }) || null;
        };
        inst.item = function item(index) {
            return inst[index] || null;
        };
        inst.removeNamedItem = function removeNamedItem(name) {
            var idx = inst.findIndex(function (attr) { return attr.name === name; });
            if (idx > -1) {
                var attr = inst[idx];
                inst.splice(idx, 1);
                return attr;
            }
            return null;
        };
        inst.removeNamedItemNS = function removeNamedItemNS(namespaceURI, localName) {
            // TODO ignore namespace for now
            return inst.removeNamedItem(localName);
        };
        inst.setNamedItem = function setNamedItem(arg) {
            var idx = inst.findIndex(function (attr) { return attr.name === arg.name; });
            if (idx === -1) {
                inst.push(arg);
            }
            else {
                inst[idx] = arg;
            }
            return arg;
        };
        inst.setNamedItemNS = function setNamedItemNS(arg) {
            // TODO ignore namespace for now
            return inst.setNamedItem(arg);
        };
        return inst;
    }
    DomLite.createNamedNodeMap = createNamedNodeMap;
    function createNodeList(copy, deep) {
        var inst = [];
        if (copy != null) {
            for (var k = 0, sz = copy.length; k < sz; k++) {
                var elem = copy[k];
                inst.push(elem.cloneNode != null ? elem.cloneNode(deep) : elem);
            }
        }
        inst.item = function item(index) {
            return inst[index];
        };
        return inst;
    }
    DomLite.createNodeList = createNodeList;
    function createDomTokenList(copy) {
        var inst = [];
        if (copy != null) {
            Array.prototype.push.apply(inst, copy);
        }
        inst.add = function add() {
            for (var i = 0, size = arguments.length; i < size; i++) {
                var argI = arguments[i];
                // only add if not already contained in list
                var idx = inst.indexOf(argI);
                if (idx === -1) {
                    inst.push(argI);
                }
            }
        };
        inst.contains = function contains(token) {
            return inst.indexOf(token) > -1;
        };
        inst.item = function item(index) {
            return inst[index];
        };
        inst.remove = function remove() {
            var token = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                token[_i] = arguments[_i];
            }
            for (var i = 0, size = arguments.length; i < size; i++) {
                var idx = inst.indexOf(arguments[i]);
                if (idx > -1) {
                    inst.splice(idx, 1);
                    return; // only remove first instance
                }
            }
        };
        inst.toString = function toString() {
            return inst.toString();
        };
        inst.toggle = function toggle(token, force) {
            if (force !== undefined) {
                if (force) {
                    inst.add(token);
                    return true;
                }
                else {
                    inst.remove(token);
                    return false;
                }
            }
            else {
                if (inst.indexOf(token) > -1) {
                    inst.remove(token);
                    return false;
                }
                else {
                    inst.push(token);
                    return true;
                }
            }
        };
        return inst;
    }
    DomLite.createDomTokenList = createDomTokenList;
})(DomLite || (DomLite = {}));
module.exports = DomLite;
