import domBldr = require("dom-builder");

/** Functions for handling XMLDocument objects
 * @since 2016-04-27
 */
class DomBuilderHelper implements domBldr.BuilderHelper {
    private static _parser: DOMParser;
    private static _serializer: XMLSerializer;

    public static getParser() {
        return DomBuilderHelper._parser != null ? DomBuilderHelper._parser : (DomBuilderHelper._parser = new DOMParser());
    }

    public static getSerializer() {
        return DomBuilderHelper._serializer != null ? DomBuilderHelper._serializer : (DomBuilderHelper._serializer = new XMLSerializer());
    }


    private dom: Document;
    private validator: DomValidate;


    constructor(dom: Document, validator: DomValidate) {
        this.dom = dom;
        this.validator = validator;
    }


    public getParser() {
        return DomBuilderHelper._parser;
    }


    public getSerializer() {
        return DomBuilderHelper._serializer;
    }


    // ==== Element.attributes utils ====
    public attrInt(attrs: NamedNodeMap, name: string, val?: number): number {
        return this._attrGetOrSet(attrs, name, parseInt, val !== undefined ? String(val) : undefined);
    }


    public attrFloat(attrs: NamedNodeMap, name: string, val?: number): number {
        return this._attrGetOrSet(attrs, name, parseFloat, val !== undefined ? String(val) : undefined);
    }


    public attrBool(attrs: NamedNodeMap, name: string, val?: boolean, skipSetFalse: boolean = true): boolean {
        return this._attrGetOrSet(attrs, name, (str) => str === "1" ? true : (str === "0" ? false : Boolean(str)), val !== undefined ? (val ? "1" : skipSetFalse ? undefined : "0") : undefined);
    }


    public attrString(attrs: NamedNodeMap, name: string, val?: string, skipSetEmpty: boolean = true): string {
        return this._attrGetOrSet(attrs, name, String, val !== undefined ? (skipSetEmpty && (val == null || val.length === 0) ? undefined : String(val)) : undefined);
    }


    private _attrGetOrSet<T extends string | number | boolean>(attrs: NamedNodeMap, name: string, parser: (str: string) => T, val?: string): T {
        if (val != null) {
            var attr = this.dom.createAttribute(name);
            attr.value = val;
            attrs.setNamedItem(attr);
            return <any>val;
        }
        var attr = attrs.getNamedItem(name);
        return attr ? parser(attr.value) : null;
    }


    // ==== Get attributes from Node ====
    public getNodeAttrInt(elem: Node, attrName: string, ifNullReturnNull?: boolean): number {
        return this._nodeAttrParse(elem, attrName, parseInt, ifNullReturnNull);
    }


    public getNodeAttrFloat(elem: Node, attrName: string, ifNullReturnNull?: boolean): number {
        return this._nodeAttrParse(elem, attrName, parseFloat, ifNullReturnNull);
    }


    public getNodeAttrBool(elem: Node, attrName: string, ifNullReturnNull?: boolean): boolean {
        return this._nodeAttrParse(elem, attrName, Boolean, ifNullReturnNull);
    }


    public getNodeAttrString(elem: Node, attrName: string, ifNullReturnNull?: boolean): string {
        return this._nodeAttrParse(elem, attrName, String, ifNullReturnNull);
    }


    private _nodeAttrParse<T>(elem: Node, attrName: string, parser: (str: string) => T, ifNullReturnNull?: boolean): T {
        if (elem == null) { return null; }
        var attr = elem.attributes.getNamedItem(attrName);
        return ifNullReturnNull && attr == null ? null : parser(attr.value);
    }


    public removeNodeAttr(elem: Node, name: string) {
        if (elem) {
            elem.attributes.removeNamedItem(name);
        }
    }


    /** get multiple attributes from a Node and return them as an object */
    public getNodeAttrs<T>(elem: Node, attrNames: string[], skipNull?: boolean): T {
        var res = {};
        if (elem == null) {
            return <T>res;
        }
        var attrs = elem.attributes;
        for (var i = 0, size = attrNames.length; i < size; i++) {
            var attrName = attrNames[i];
            var attr = attrs.getNamedItem(attrName);
            if (!skipNull || attr != null) {
                res[attrName] = attr.value;
            }
        }
        return <T>res;
    }


    // ==== .children ====
    public queryOneChild<T extends Element>(parent: NodeSelector | T, selectors: string): T {
        // TODO only the newest browsers support this
        var res = (<T>parent.querySelector(":scope > " + selectors));
        return res;
    }

    public queryOneAndGetChilds<T extends Element>(parent: NodeSelector | T, selectors: string): T[] {
        var res = (<HTMLElement>parent.querySelector(selectors));
        if (!res) { throw this.validator.missingNode(selectors); }
        var resAry = Array.prototype.slice.call(res.children);
        return resAry;
    }

    public queryAll<T extends Element>(parent: NodeSelector | T, selectors: string): T[] {
        var res = parent.querySelectorAll(selectors);
        var resAry = Array.prototype.slice.call(res);
        return resAry;
    }

    public queryAllChilds<T extends Element>(parent: NodeSelector | T, selectors: string): T[] {
        // TODO only the newest browsers support this
        return this.queryAll<T>(parent, ":scope > " + selectors);
    }


    public getChilds<T extends Node>(elem: T): T[] {
        var resAry = Array.prototype.slice.call(elem.childNodes);
        return resAry;
    }


    public removeChilds(elem: Element) {
        var lastChild = null;
        while (lastChild = elem.lastChild) {
            elem.removeChild(lastChild);
        }
    }


    public addChilds(parent: Element, childs: Element[] | ArrayLike<Element>) {
        for (var i = 0, size = childs.length; i < size; i++) {
            parent.appendChild(childs[i]);
        }
    }

}

export = DomBuilderHelper;