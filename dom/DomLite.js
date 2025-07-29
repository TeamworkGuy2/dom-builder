"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomLite = void 0;
/**
 * Contains very basic implementations of DOM elements:
 * - {@link DocLike}
 * - {@link ElemLike}
 * - {@link AttrLike}
 * - {@link TextNodeLike}
 */
var DomLite;
(function (DomLite) {
    DomLite.XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
    DomLite.XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
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
    var AttrLike = /** @class */ (function () {
        function AttrLike(qualifiedName, value, namespaceUri) {
            var colonIdx = qualifiedName.indexOf(":");
            this.name = qualifiedName;
            this.namespaceURI = namespaceUri || null;
            this.value = "" + value;
            if (colonIdx > 0) {
                this.localName = qualifiedName.substring(colonIdx + 1);
                this.prefix = qualifiedName.substring(0, colonIdx);
                // force overwrite the namespace URI if it's known
                // the correct logic is:
                // - check the 'prefix' against top level namespaces
                // - check the 'prefix' against the namespace hierarchy of parent tags
                // - 'xmlns' seems to correspond to the empty '' prefix,
                //   i.e. nodes without a 'prefix' inherit the first 'xmlns' attribute of the parent tag hierarchy or the default XMLNS_NAMESPACE?
                switch (this.prefix) {
                    case 'xml':
                        this.namespaceURI = DomLite.XML_NAMESPACE;
                        break;
                    case 'xmlns':
                        this.namespaceURI = DomLite.XMLNS_NAMESPACE;
                        break;
                }
            }
        }
        return AttrLike;
    }());
    DomLite.AttrLike = AttrLike;
    var DocLike = /** @class */ (function () {
        function DocLike(ns, rootNodeName, contentType) {
            this.documentElement = new ElemLike(rootNodeName, ns);
            this.contentType = contentType;
            if (ns != null) {
                this.documentElement.attributes.setNamedItem({ name: "xmlns", value: ns });
            }
        }
        DocLike.prototype.lookupNamespaceURI = function (prefix) {
            // TODO: this isn't correct, but close enough for 'xlsx-spec-utils' use case
            // see https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupNamespaceURI
            switch (prefix) {
                case 'xml':
                    return DomLite.XML_NAMESPACE;
                case 'xmlns':
                    return DomLite.XMLNS_NAMESPACE;
            }
            return this.documentElement.namespaceURI || null;
        };
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
            return this.documentElement.toString();
        };
        return DocLike;
    }());
    DomLite.DocLike = DocLike;
    var ElemLike = /** @class */ (function () {
        function ElemLike(qualifiedName, namespaceUri) {
            this.id = "";
            this.nodeValue = null;
            this.textContent = null;
            this.firstChild = null;
            this.lastChild = null;
            this._attributes = null;
            this._childNodes = null;
            this.nodeName = qualifiedName;
            if (namespaceUri) {
                this.namespaceURI = namespaceUri;
            }
        }
        Object.defineProperty(ElemLike.prototype, "attributes", {
            get: function () {
                return this._attributes || (this._attributes = createNamedNodeMap());
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ElemLike.prototype, "childNodes", {
            get: function () {
                return this._childNodes || (this._childNodes = createNodeList());
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ElemLike.prototype, "classList", {
            get: function () {
                return this._classList || (this._classList = createDomTokenList());
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ElemLike.prototype, "style", {
            get: function () {
                return this._style || (this._style = createCssStyle());
            },
            enumerable: false,
            configurable: true
        });
        ElemLike.prototype.appendChild = function (newChild) {
            var childs = this._childNodes = this._childNodes || createNodeList();
            childs.push(newChild);
            if (childs.length === 1) {
                this.firstChild = newChild;
            }
            this.lastChild = newChild;
            return newChild;
        };
        ElemLike.prototype.removeChild = function (oldChild) {
            var _a;
            var childs = this._childNodes;
            var idx = (_a = childs === null || childs === void 0 ? void 0 : childs.indexOf(oldChild)) !== null && _a !== void 0 ? _a : -1;
            if (childs != null && idx > -1) {
                // update childNodes
                removeIndex(childs, idx);
                // update firstChild/lastChild
                if (idx === childs.length) {
                    if (childs.length > 0) {
                        this.lastChild = childs[childs.length - 1];
                    }
                    else {
                        this.lastChild = null;
                        this.firstChild = null;
                    }
                }
                return oldChild;
            }
            throw new Error("The node to be removed is not a child of this node");
        };
        ElemLike.prototype.addEventListener = function (type, listener, options) {
            // do nothing
        };
        ElemLike.prototype.setAttribute = function (name, value) {
            this.attributes.setNamedItem(createAttribute(name, value, this.namespaceURI));
        };
        ElemLike.prototype.setAttributeNS = function (namespaceURI, qualifiedName, value) {
            this.attributes.setNamedItemNS(createAttribute(qualifiedName, value, namespaceURI || this.namespaceURI));
        };
        ElemLike.prototype.toString = function (indent, currentIndent) {
            var str = (currentIndent || "") + "<" + this.nodeName;
            if (this._attributes != null) {
                var attrs = [];
                for (var i = 0, size = this._attributes.length; i < size; i++) {
                    var attr = this._attributes[i];
                    attrs.push(attr.name + "=\"" + attr.value + "\"");
                }
                str += (attrs.length > 0 ? " " + attrs.join(" ") : "");
            }
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
            var copy = new ElemLike(this.nodeName, this.namespaceURI);
            copy.id = this.id;
            copy.nodeValue = this.nodeValue;
            copy.textContent = this.textContent;
            copy._attributes = (deep && this._attributes != null ? createNamedNodeMap(this._attributes) : null);
            copy._childNodes = (deep && this._childNodes != null ? createNodeList(this._childNodes, deep) : null);
            copy._classList = (deep && this._classList != null ? createDomTokenList(this._classList) : null);
            copy._style = (deep && this._style != null ? createCssStyle(this._style) : null);
            copy.firstChild = copy._childNodes && copy._childNodes.length > 0 ? copy._childNodes[0] : null;
            copy.lastChild = copy._childNodes && copy._childNodes.length > 0 ? copy._childNodes[copy._childNodes.length - 1] : null;
            return copy;
        };
        return ElemLike;
    }());
    DomLite.ElemLike = ElemLike;
    var TextNodeLike = /** @class */ (function () {
        function TextNodeLike(data) {
            this.textContent = null;
            this.attributes = null;
            this.childNodes = EMPTY_LIST;
            this.nodeName = "#text";
            this.nodeValue = data;
        }
        TextNodeLike.prototype.appendChild = function (newChild) {
            throw new Error("Child nodes cannot be appended to a Text node");
        };
        TextNodeLike.prototype.removeChild = function (oldChild) {
            throw new Error("Child nodes cannot be removed from a Text node");
        };
        TextNodeLike.prototype.addEventListener = function (type, listener, options) {
            // do nothing
        };
        TextNodeLike.prototype.toString = function () {
            return this.nodeValue || "";
        };
        TextNodeLike.prototype.cloneNode = function (deep) {
            return new TextNodeLike(this.nodeValue);
        };
        return TextNodeLike;
    }());
    DomLite.TextNodeLike = TextNodeLike;
    function createCssStyle(copy) {
        var inst = Object.create(copy != null ? Object.assign({}, copy) : {}, {
            getPropertyPriority: {
                value: function getPropertyPriority(propertyName) {
                    // TODO ignores priority
                    return "";
                }
            },
            getPropertyValue: {
                value: function getPropertyValue(propertyName) {
                    return inst[propertyName];
                }
            },
            item: {
                value: function item(index) {
                    // TODO inefficient
                    var keys = Object.keys(inst);
                    return inst[keys[index]];
                }
            },
            length: {
                get: function get() {
                    // TODO inefficient
                    return Object.keys(inst).length;
                }
            },
            removeProperty: {
                value: function removeProperty(propertyName) {
                    var oldVal = inst[propertyName];
                    delete inst[propertyName];
                    return oldVal;
                }
            },
            setProperty: {
                value: function setProperty(propertyName, value, priority) {
                    // TODO ignores priority parameter
                    inst[propertyName] = value;
                }
            },
        });
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
        Object.defineProperties(inst, {
            getNamedItem: {
                value: function getNamedItem(name) {
                    return inst.find(function (attr) { return attr.name === name; }) || null;
                }
            },
            getNamedItemNS: {
                value: function getNamedItemNS(namespaceURI, localName) {
                    return inst.find(function (attr) { return attr.name === localName; }) || null;
                }
            },
            item: {
                value: function item(index) {
                    return inst[index] || null;
                }
            },
            removeNamedItem: {
                value: function removeNamedItem(name) {
                    var idx = inst.findIndex(function (attr) { return attr.name === name; });
                    if (idx > -1) {
                        var attr = inst[idx];
                        inst.splice(idx, 1);
                        return attr;
                    }
                    return null;
                }
            },
            removeNamedItemNS: {
                value: function removeNamedItemNS(namespaceURI, localName) {
                    // TODO ignore namespace for now
                    return inst.removeNamedItem(localName);
                }
            },
            setNamedItem: {
                value: function setNamedItem(arg) {
                    var idx = inst.findIndex(function (attr) { return attr.name === arg.name; });
                    if (idx === -1) {
                        inst.push(arg);
                    }
                    else {
                        inst[idx] = arg;
                    }
                    return arg;
                }
            },
            setNamedItemNS: {
                value: function setNamedItemNS(arg) {
                    // TODO ignore namespace for now
                    return inst.setNamedItem(arg);
                }
            },
        });
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
        Object.defineProperties(inst, {
            item: {
                value: function item(index) {
                    return inst[index];
                }
            },
        });
        return inst;
    }
    DomLite.createNodeList = createNodeList;
    function createDomTokenList(copy) {
        var inst = [];
        if (copy != null) {
            Array.prototype.push.apply(inst, copy);
        }
        Object.defineProperties(inst, {
            add: {
                value: function add() {
                    for (var i = 0, size = arguments.length; i < size; i++) {
                        var argI = arguments[i];
                        // only add if not already contained in list
                        var idx = inst.indexOf(argI);
                        if (idx === -1) {
                            inst.push(argI);
                        }
                    }
                }
            },
            contains: {
                value: function contains(token) {
                    return inst.indexOf(token) > -1;
                }
            },
            item: {
                value: function item(index) {
                    return inst[index];
                }
            },
            remove: {
                value: function remove() {
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
                }
            },
            toString: {
                value: function toString() {
                    return inst.toString();
                }
            },
            toggle: {
                value: function toggle(token, force) {
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
                }
            },
        });
        return inst;
    }
    DomLite.createDomTokenList = createDomTokenList;
    function removeIndex(ary, index) {
        if (ary == null) {
            return null;
        }
        var size = ary.length;
        if (size < 1 || index < 0 || index >= size) {
            return ary;
        }
        for (var i = index + 1; i < size; i++) {
            ary[i - 1] = ary[i];
        }
        ary[size - 1] = null;
        ary.length = size - 1;
        return ary;
    }
})(DomLite = exports.DomLite || (exports.DomLite = {}));
