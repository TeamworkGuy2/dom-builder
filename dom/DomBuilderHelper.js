"use strict";
/** Helper functions for XMLDocument Node attributes and children
 * @since 2016-04-27
 */
var DomBuilderHelper = (function () {
    function DomBuilderHelper(dom, validator) {
        this._dom = dom;
        this._validator = validator;
    }
    DomBuilderHelper.getParser = function () {
        return DomBuilderHelper._parser != null ? DomBuilderHelper._parser : (DomBuilderHelper._parser = new DOMParser());
    };
    DomBuilderHelper.getSerializer = function () {
        return DomBuilderHelper._serializer != null ? DomBuilderHelper._serializer : (DomBuilderHelper._serializer = new XMLSerializer());
    };
    DomBuilderHelper.prototype.getParser = function () {
        return DomBuilderHelper._parser;
    };
    DomBuilderHelper.prototype.getSerializer = function () {
        return DomBuilderHelper._serializer;
    };
    // ==== Element.attributes utils ====
    DomBuilderHelper.prototype.attrInt = function (attrs, name, val) {
        return this._attrGetOrSet(attrs, name, parseInt, val !== undefined ? String(val) : undefined);
    };
    DomBuilderHelper.prototype.attrFloat = function (attrs, name, val) {
        return this._attrGetOrSet(attrs, name, parseFloat, val !== undefined ? String(val) : undefined);
    };
    DomBuilderHelper.prototype.attrBool = function (attrs, name, val, skipSetFalse) {
        if (skipSetFalse === void 0) { skipSetFalse = true; }
        return this._attrGetOrSet(attrs, name, function (str) { return str === "1" ? true : (str === "0" ? false : Boolean(str)); }, val !== undefined ? (val ? "1" : skipSetFalse ? undefined : "0") : undefined);
    };
    DomBuilderHelper.prototype.attrString = function (attrs, name, val, skipSetEmpty) {
        if (skipSetEmpty === void 0) { skipSetEmpty = true; }
        return this._attrGetOrSet(attrs, name, String, val !== undefined ? (skipSetEmpty && (val == null || val.length === 0) ? undefined : String(val)) : undefined);
    };
    DomBuilderHelper.prototype._attrGetOrSet = function (attrs, name, parser, val) {
        if (val != null) {
            var attr = this._dom.createAttribute(name);
            attr.value = val;
            attrs.setNamedItem(attr);
            return val;
        }
        var attr = attrs.getNamedItem(name);
        return attr ? parser(attr.value) : null;
    };
    // ==== Get attributes from Node ====
    DomBuilderHelper.prototype.getNodeAttrInt = function (elem, attrName, defaultValue) {
        return this._nodeAttrParse(elem, attrName, parseInt, defaultValue);
    };
    DomBuilderHelper.prototype.getNodeAttrFloat = function (elem, attrName, defaultValue) {
        return this._nodeAttrParse(elem, attrName, parseFloat, defaultValue);
    };
    DomBuilderHelper.prototype.getNodeAttrBool = function (elem, attrName, defaultValue) {
        return this._nodeAttrParse(elem, attrName, function (str) { return (str === "true"); }, defaultValue);
    };
    DomBuilderHelper.prototype.getNodeAttrString = function (elem, attrName, defaultValue) {
        return this._nodeAttrParse(elem, attrName, String, defaultValue);
    };
    DomBuilderHelper.prototype._nodeAttrParse = function (elem, attrName, parser, defaultValue) {
        if (elem == null) {
            return null;
        }
        var attr = elem.attributes.getNamedItem(attrName);
        return attr != null ? parser(attr.value) : (defaultValue != null ? defaultValue : null);
    };
    DomBuilderHelper.prototype.removeNodeAttr = function (elem, name) {
        if (elem) {
            elem.attributes.removeNamedItem(name);
        }
    };
    DomBuilderHelper.prototype.getNodeAttrs = function (elem, attrNames, skipNull) {
        var res = {};
        if (elem == null) {
            return res;
        }
        var attrs = elem.attributes;
        for (var i = 0, size = attrNames.length; i < size; i++) {
            var attrName = attrNames[i];
            var attr = attrs.getNamedItem(attrName);
            if (!skipNull || attr != null) {
                res[attrName] = attr.value;
            }
        }
        return res;
    };
    // ==== .children ====
    DomBuilderHelper.prototype.queryOneChild = function (parent, selectors) {
        // TODO only the newest browsers support this
        var res = parent.querySelector(":scope > " + selectors);
        return res;
    };
    DomBuilderHelper.prototype.queryOneAndGetChilds = function (parent, selectors) {
        var res = parent.querySelector(selectors);
        if (!res) {
            throw this._validator.missingNode(selectors);
        }
        var resAry = Array.prototype.slice.call(res.children);
        return resAry;
    };
    DomBuilderHelper.prototype.queryAll = function (parent, selectors) {
        var res = parent.querySelectorAll(selectors);
        var resAry = Array.prototype.slice.call(res);
        return resAry;
    };
    DomBuilderHelper.prototype.queryAllChilds = function (parent, selectors) {
        // TODO only the newest browsers support this
        return this.queryAll(parent, ":scope > " + selectors);
    };
    DomBuilderHelper.prototype.getChilds = function (elem) {
        var resAry = Array.prototype.slice.call(elem.childNodes);
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
    return DomBuilderHelper;
}());
module.exports = DomBuilderHelper;
