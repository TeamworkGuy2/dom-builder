"use strict";
/** A wrapper for a DOM element (similar to how a JQuery object wraps one or more DOM elements).
 * Reduces the code required to create and setup a new element for insertion into a Document.
 * Includes functions to set the element's ID, add class names, add styles, set attributes, set the element's text content, and add child elements.
 * Access the 'element' property at any time to retrieve the underlying DOM element.
 * @author TeamworkGuy2
 * @since 2016-04-26
 */
var DomBuilder = /** @class */ (function () {
    function DomBuilder(elem, dom) {
        this.elem = elem;
        this.dom = dom;
    }
    Object.defineProperty(DomBuilder.prototype, "element", {
        get: function () {
            return this.elem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomBuilder.prototype, "document", {
        get: function () {
            return this.dom;
        },
        enumerable: true,
        configurable: true
    });
    DomBuilder.prototype.classes = function (classNames) {
        var clsList = this.elem.classList;
        if (Array.isArray(classNames)) {
            for (var i = 0, size = classNames.length; i < size; i++) {
                clsList.add(classNames[i]);
            }
        }
        else if (classNames != null) {
            clsList.add(classNames);
        }
        return this;
    };
    DomBuilder.prototype.id = function (id) {
        if (id != null) {
            this.elem.id = id;
        }
        return this;
    };
    DomBuilder.prototype.styles = function (styles, skipNulls) {
        var elemStyle = this.elem.style;
        if (styles != null) {
            var keys = Object.keys(styles);
            for (var i = 0, size = keys.length; i < size; i++) {
                var style = styles[keys[i]];
                if (!skipNulls || style != null) {
                    elemStyle[keys[i]] = style;
                }
            }
        }
        return this;
    };
    DomBuilder.prototype.style = function (name, value, skipNull) {
        if (!skipNull || value != null) {
            this.elem.style[name] = (value ? String(value) : value);
        }
        return this;
    };
    DomBuilder.prototype.attrs = function (attrs, skipNulls) {
        var elem = this.elem;
        if (attrs) {
            var attrsMap = attrs;
            for (var key in attrsMap) {
                var attrVal = attrsMap[key];
                if (Object.prototype.hasOwnProperty.call(attrsMap, key) && (!skipNulls || attrVal != null)) {
                    elem.setAttribute(key, attrVal);
                }
            }
        }
        return this;
    };
    DomBuilder.prototype.attr = function (name, value, skipNull) {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    };
    DomBuilder.prototype.attrBool = function (name, value, skipFalseOrNull, trueVal, falseVal) {
        return this._attr(name, skipFalseOrNull && (value == null || value == false) ? null : value === true ? (trueVal !== undefined ? trueVal : "true") : (falseVal !== undefined ? falseVal : "false"), skipFalseOrNull);
    };
    DomBuilder.prototype.attrInt = function (name, value, skipNull) {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    };
    DomBuilder.prototype.attrFloat = function (name, value, skipNull) {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    };
    DomBuilder.prototype.attrString = function (name, value, skipEmptyOrNull) {
        return this._attr(name, skipEmptyOrNull && (value == null || value.length === 0) ? null : value, skipEmptyOrNull);
    };
    DomBuilder.prototype._attr = function (name, value, skipNull) {
        if (!skipNull || value != null) {
            this.elem.setAttribute(name, value);
        }
        return this;
    };
    DomBuilder.prototype.text = function (textContent) {
        this.elem.textContent = (textContent ? String(textContent) : textContent);
        return this;
    };
    DomBuilder.prototype.addChild = function (elems) {
        if (Array.isArray(elems)) {
            for (var i = 0, size = elems.length; i < size; i++) {
                var el = elems[i];
                this.elem.appendChild(DomBuilder.isDomBuilder(el) ? el.element : el);
            }
        }
        else if (elems) {
            this.elem.appendChild(DomBuilder.isDomBuilder(elems) ? elems.element : elems);
        }
        return this;
    };
    DomBuilder.prototype.textOrChild = function (textOrElem) {
        if (textOrElem.nodeName) {
            this.addChild(textOrElem);
        }
        else {
            this.text(textOrElem);
        }
        return this;
    };
    DomBuilder.prototype.onEvent = function (eventName, handler, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        this.elem.addEventListener(eventName, handler, useCapture);
        return this;
    };
    DomBuilder.isDomBuilder = function (elem) {
        return elem.textOrChild !== undefined && elem.attr !== undefined;
    };
    DomBuilder.newInst = function (elem, dom, id, classes, styles) {
        var inst = new DomBuilder(elem, dom);
        inst.id(id).classes(classes).styles(styles);
        return inst;
    };
    return DomBuilder;
}());
module.exports = DomBuilder;
