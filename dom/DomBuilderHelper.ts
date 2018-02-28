import domBldr = require("dom-builder");

/** Helper functions for XMLDocument Node attributes and children
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


    private _dom: DocumentLike;
    private _validator: DomValidate;


    constructor(dom: DocumentLike, validator: DomValidate) {
        this._dom = dom;
        this._validator = validator;
    }


    public getParser() {
        return DomBuilderHelper._parser;
    }


    public getSerializer() {
        return DomBuilderHelper._serializer;
    }


    // ==== Element.attributes utils ====

    public attrInt(attrs: NamedNodeMap, name: string, val?: number): number | null {
        return this._attrGetOrSet(attrs, name, parseInt, val !== undefined ? String(val) : undefined);
    }


    public attrFloat(attrs: NamedNodeMap, name: string, val?: number): number | null {
        return this._attrGetOrSet(attrs, name, parseFloat, val !== undefined ? String(val) : undefined);
    }


    public attrBool(attrs: NamedNodeMap, name: string, val?: boolean, skipSetFalse: boolean = true): boolean | null {
        return this._attrGetOrSet(attrs, name, (str) => str === "1" ? true : (str === "0" ? false : Boolean(str)), val !== undefined ? (val ? "1" : skipSetFalse ? undefined : "0") : undefined);
    }


    public attrString(attrs: NamedNodeMap, name: string, val?: string, skipSetEmpty: boolean = true): string | null {
        return this._attrGetOrSet(attrs, name, String, val !== undefined ? (skipSetEmpty && (val == null || val.length === 0) ? undefined : String(val)) : undefined);
    }


    private _attrGetOrSet<T extends string | number | boolean>(attrs: NamedNodeMapLike, name: string, parser: (str: string) => T, val: string | null | undefined): T | null {
        if (val != null) {
            var attr: AttributeLike | null = this._dom.createAttribute(name);
            attr.value = val;
            attrs.setNamedItem(attr);
            return <any>val;
        }
        var attr = attrs.getNamedItem(name);
        return attr ? parser(attr.value) : null;
    }


    // ==== Get attributes from Node ====

    public getNodeAttrInt(elem: HasAttributes, attrName: string, defaultValue?: number): number | null {
        return this._nodeAttrParse(elem, attrName, parseInt, defaultValue);
    }


    public getNodeAttrFloat(elem: HasAttributes, attrName: string, defaultValue?: number): number | null {
        return this._nodeAttrParse(elem, attrName, parseFloat, defaultValue);
    }


    public getNodeAttrBool(elem: HasAttributes, attrName: string, defaultValue?: boolean): boolean | null {
        return this._nodeAttrParse(elem, attrName, (str) => (str === "true"), defaultValue);
    }


    public getNodeAttrString(elem: HasAttributes, attrName: string, defaultValue?: string): string | null {
        return this._nodeAttrParse(elem, attrName, String, defaultValue);
    }


    private _nodeAttrParse<T>(elem: HasAttributes, attrName: string, parser: (str: string) => T, defaultValue?: T): T | null {
        if (elem == null) { return null; }
        var attr = elem.attributes.getNamedItem(attrName);
        return attr != null ? parser(attr.value) : (defaultValue != null ? defaultValue : null);
    }


    public removeNodeAttr(elem: HasAttributes, name: string) {
        if (elem) {
            elem.attributes.removeNamedItem(name);
        }
    }


    /** get multiple attributes from a Node and return them as an object */
    public getNodeAttrs<K extends string>(elem: HasAttributes, attrNames: K[], skipNull?: boolean): { [P in K]: string };
    public getNodeAttrs<T extends object>(elem: HasAttributes, attrNames: (keyof T)[], skipNull?: boolean): T {
        var res = <T>{};
        if (elem == null) {
            return res;
        }
        var attrs = elem.attributes;
        for (var i = 0, size = attrNames.length; i < size; i++) {
            var attrName = attrNames[i];
            var attr = attrs.getNamedItem(attrName);
            if (!skipNull || attr != null) {
                res[attrName] = attr != null ? <any>attr.value : <any>null;
            }
        }
        return res;
    }


    // ==== .children ====

    public queryOneChild<T extends Element>(parent: NodeSelector | T, selectors: string): T {
        // TODO only the newest browsers support this
        var res = (<T>parent.querySelector(":scope > " + selectors));
        return res;
    }


    public queryOneAndGetChilds<T extends Element>(parent: NodeSelector | T, selectors: string): T[] {
        var res = (<HTMLElement>parent.querySelector(selectors));
        if (!res) { throw this._validator.missingNode(selectors); }
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


    public getChilds<T extends NodeLike>(elem: T): T[] {
        var resAry = Array.prototype.slice.call(elem.childNodes);
        return resAry;
    }


    public removeChilds(elem: Element) {
        var lastChild: Node | null = null;
        while (lastChild = elem.lastChild) {
            elem.removeChild(lastChild);
        }
    }


    public addChilds(parent: ElementLike, childs: ElementLike[] | ArrayLike<ElementLike>) {
        for (var i = 0, size = childs.length; i < size; i++) {
            parent.appendChild(childs[i]);
        }
    }

}

export = DomBuilderHelper;