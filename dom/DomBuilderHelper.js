"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomBuilderHelper = void 0;
/** Helper functions for XMLDocument Node attributes and children.
 * Useful for manipulating existing elements.
 * Includes a global {@link getParser} and {@link getSerializer} which default to {@link DOMParser}
 * and {@link XMLSerializer}, and can be overridden with {@link setParser} and {@link setSerializer}.
 * @since 2016-04-27
 */
var DomBuilderHelper = /** @class */ (function () {
    function DomBuilderHelper(dom, validator) {
        this._dom = dom;
        this._validator = validator;
    }
    /**
     * @returns the last parser set by {@link setParser} or a default {@link DOMParser}
     */
    DomBuilderHelper.getParser = function () {
        return DomBuilderHelper._parser != null ? DomBuilderHelper._parser : (DomBuilderHelper._parser = new DOMParser());
    };
    /**
     * @returns the last serializer set by {@link setSerializer} or a default {@link XMLSerializer}
     */
    DomBuilderHelper.getSerializer = function () {
        return DomBuilderHelper._serializer != null ? DomBuilderHelper._serializer : (DomBuilderHelper._serializer = new XMLSerializer());
    };
    /**
     * Set the default parser returned by {@link getParser}
     */
    DomBuilderHelper.setParser = function (parser) {
        DomBuilderHelper._parser = parser;
    };
    /**
     * Set the default serializer returned by {@link getSerializer}
     */
    DomBuilderHelper.setSerializer = function (serializer) {
        DomBuilderHelper._serializer = serializer;
    };
    DomBuilderHelper.prototype.getParser = function () {
        return DomBuilderHelper._parser;
    };
    DomBuilderHelper.prototype.getSerializer = function () {
        return DomBuilderHelper._serializer;
    };
    // ==== Element.attributes utils ====
    DomBuilderHelper.prototype.attrInt = function (elem, name, val, throwIfMissing) {
        // set
        if (val != null) {
            elem.setAttribute(name, String(val));
            return val;
        }
        // get
        else {
            return this._getAttrParse(elem, name, parseInt, throwIfMissing);
        }
    };
    DomBuilderHelper.prototype.attrFloat = function (elem, name, val, throwIfMissing) {
        // set
        if (val != null) {
            elem.setAttribute(name, String(val));
            return val;
        }
        // get
        else {
            return this._getAttrParse(elem, name, parseFloat, throwIfMissing);
        }
    };
    DomBuilderHelper.prototype.attrBool = function (elem, name, val, skipSetFalse, throwIfMissing) {
        if (skipSetFalse === void 0) { skipSetFalse = true; }
        // set
        if (val != null) {
            var valStr = val ? "1" : (skipSetFalse ? undefined : "0");
            if (valStr != null) {
                elem.setAttribute(name, valStr);
            }
            return val;
        }
        // get
        else {
            return this._getAttrParse(elem, name, DomBuilderHelper.parseBooleanLike, throwIfMissing);
        }
    };
    DomBuilderHelper.prototype.attrString = function (elem, name, val, skipSetEmpty, throwIfMissing) {
        if (skipSetEmpty === void 0) { skipSetEmpty = true; }
        // set
        if (val != null) {
            var valStr = skipSetEmpty && (val == null || val.length === 0) ? undefined : String(val);
            if (valStr != null) {
                elem.setAttribute(name, valStr);
            }
            return val;
        }
        // get
        else {
            return this._getAttrParse(elem, name, String, throwIfMissing);
        }
    };
    // ==== Get attributes from Node ====
    DomBuilderHelper.prototype.getAttrInt = function (elem, attrName, defaultValue, throwIfMissing) {
        var _a;
        return (_a = this._getAttrParse(elem, attrName, parseInt, throwIfMissing)) !== null && _a !== void 0 ? _a : (defaultValue != null ? defaultValue : null);
    };
    DomBuilderHelper.prototype.getAttrFloat = function (elem, attrName, defaultValue, throwIfMissing) {
        var _a;
        return (_a = this._getAttrParse(elem, attrName, parseFloat, throwIfMissing)) !== null && _a !== void 0 ? _a : (defaultValue != null ? defaultValue : null);
    };
    DomBuilderHelper.prototype.getAttrBool = function (elem, attrName, defaultValue, throwIfMissing) {
        var _a;
        return (_a = this._getAttrParse(elem, attrName, DomBuilderHelper.parseBoolean, throwIfMissing)) !== null && _a !== void 0 ? _a : (defaultValue != null ? defaultValue : null);
    };
    DomBuilderHelper.prototype.getAttrString = function (elem, attrName, defaultValue, throwIfMissing) {
        var _a;
        return (_a = this._getAttrParse(elem, attrName, String, throwIfMissing)) !== null && _a !== void 0 ? _a : (defaultValue != null ? defaultValue : null);
    };
    DomBuilderHelper.prototype._getAttrParse = function (elem, attrName, parser, throwIfMissing) {
        if (elem == null) {
            return null;
        }
        var attr = elem.attributes.getNamedItem(attrName);
        if (throwIfMissing && attr == null) {
            throw this._validator.missingAttribute(attrName, elem);
        }
        return attr != null ? parser(attr.value) : null;
    };
    DomBuilderHelper.prototype.removeAttr = function (elem, name) {
        if (elem) {
            elem.attributes.removeNamedItem(name);
        }
    };
    /** get multiple attributes from a Node and return them as an object */
    DomBuilderHelper.prototype.getAttrs = function (elem, attrNames, skipNull) {
        var res = {};
        if (elem == null) {
            return res;
        }
        var attrs = elem.attributes;
        for (var i = 0, size = attrNames.length; i < size; i++) {
            var attrName = attrNames[i];
            var attr = attrs.getNamedItem(attrName);
            if (!skipNull || attr != null) {
                res[attrName] = attr != null ? attr.value : null;
            }
        }
        return res;
    };
    DomBuilderHelper.prototype.queryOneChild = function (parent, selectors, throwIfNone) {
        if (throwIfNone === void 0) { throwIfNone = true; }
        // NOTE: only newer browsers support this
        var res = parent.querySelector(":scope > " + selectors);
        if (throwIfNone && res == null) {
            throw this._validator.missingNode(selectors, parent);
        }
        return res;
    };
    DomBuilderHelper.prototype.queryOneAndGetChilds = function (parent, selectors) {
        var res = parent.querySelector(selectors);
        if (!res) {
            throw this._validator.missingNode(selectors, parent);
        }
        var resAry = Array.prototype.slice.call(res.children);
        return resAry;
    };
    DomBuilderHelper.prototype.queryAllChilds = function (parent, selectors) {
        // NOTE: only newer browsers support this
        return this.queryAll(parent, ":scope > " + selectors);
    };
    DomBuilderHelper.prototype.queryAll = function (parent, selectors) {
        var res = parent.querySelectorAll(selectors);
        var resAry = Array.prototype.slice.call(res);
        return resAry;
    };
    DomBuilderHelper.prototype.getChildNodes = function (elem) {
        var resAry = Array.prototype.slice.call(elem.childNodes);
        return resAry;
    };
    DomBuilderHelper.prototype.getChildren = function (elem) {
        var resAry = Array.prototype.slice.call(elem.children);
        return resAry;
    };
    DomBuilderHelper.prototype.removeChilds = function (elem) {
        var lastChild = null;
        while (lastChild = elem.lastChild) {
            elem.removeChild(lastChild);
        }
    };
    DomBuilderHelper.prototype.addChilds = function (parent, childs) {
        for (var i = 0, size = childs.length; i < size; i++) {
            parent.appendChild(childs[i]);
        }
    };
    DomBuilderHelper.parseBoolean = function (str) { return (str === "true"); };
    DomBuilderHelper.parseBooleanLike = function (str) { return str === "1" ? true : (str === "0" ? false : Boolean(str)); };
    return DomBuilderHelper;
}());
exports.DomBuilderHelper = DomBuilderHelper;
