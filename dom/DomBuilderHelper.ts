import { BuilderHelper } from "dom-builder";

/** Helper functions for XMLDocument Node attributes and children.
 * Useful for manipulating existing elements.
 * Includes a global {@link getParser} and {@link getSerializer} which default to {@link DOMParser}
 * and {@link XMLSerializer}, and can be overridden with {@link setParser} and {@link setSerializer}.
 * @since 2016-04-27
 */
export class DomBuilderHelper implements BuilderHelper {
    private static _parser: DOMParser;
    private static _serializer: XMLSerializer;
    private static parseBoolean = (str: string | null | undefined) => (str === "true");
    private static parseBooleanLike = (str: string | null | undefined) => str === "1" ? true : (str === "0" ? false : Boolean(str));

    /**
     * @returns the last parser set by {@link setParser} or a default {@link DOMParser}
     */
    public static getParser() {
        return DomBuilderHelper._parser != null ? DomBuilderHelper._parser : (DomBuilderHelper._parser = new DOMParser());
    }

    /**
     * @returns the last serializer set by {@link setSerializer} or a default {@link XMLSerializer}
     */
    public static getSerializer() {
        return DomBuilderHelper._serializer != null ? DomBuilderHelper._serializer : (DomBuilderHelper._serializer = new XMLSerializer());
    }

    /**
     * Set the default parser returned by {@link getParser}
     */
    public static setParser(parser: DOMParser) {
        DomBuilderHelper._parser = parser;
    }

    /**
     * Set the default serializer returned by {@link getSerializer}
     */
    public static setSerializer(serializer: XMLSerializer) {
        DomBuilderHelper._serializer = serializer;
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

    public attrInt(elem: ElementLike, name: string, val?: number, throwIfMissing?: boolean): number | null {
        // set
        if (val != null) {
            elem.setAttribute(name, String(val));
            return val;
        }
        // get
        else {
            return this._getAttrParse(elem, name, parseInt, throwIfMissing);
        }
    }


    public attrFloat(elem: ElementLike, name: string, val?: number, throwIfMissing?: boolean): number | null {
        // set
        if (val != null) {
            elem.setAttribute(name, String(val));
            return val;
        }
        // get
        else {
            return this._getAttrParse(elem, name, parseFloat, throwIfMissing);
        }
    }


    public attrBool(elem: ElementLike, name: string, val?: boolean, skipSetFalse: boolean = true, throwIfMissing?: boolean): boolean | null {
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
    }


    public attrString(elem: ElementLike, name: string, val?: string, skipSetEmpty: boolean = true, throwIfMissing?: boolean): string | null {
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
    }


    // ==== Get attributes from Node ====

    public getAttrInt(elem: HasAttributes, attrName: string, defaultValue?: number, throwIfMissing?: boolean): number | null {
        return this._getAttrParse(elem, attrName, parseInt, throwIfMissing) ?? (defaultValue != null ? defaultValue : null);
    }


    public getAttrFloat(elem: HasAttributes, attrName: string, defaultValue?: number, throwIfMissing?: boolean): number | null {
        return this._getAttrParse(elem, attrName, parseFloat, throwIfMissing) ?? (defaultValue != null ? defaultValue : null);
    }


    public getAttrBool(elem: HasAttributes, attrName: string, defaultValue?: boolean, throwIfMissing?: boolean): boolean | null {
        return this._getAttrParse(elem, attrName, DomBuilderHelper.parseBoolean, throwIfMissing) ?? (defaultValue != null ? defaultValue : null);
    }


    public getAttrString(elem: HasAttributes, attrName: string, defaultValue?: string, throwIfMissing?: boolean): string | null {
        return this._getAttrParse(elem, attrName, String, throwIfMissing) ?? (defaultValue != null ? defaultValue : null);
    }


    private _getAttrParse<T>(elem: HasAttributes, attrName: string, parser: (str: string) => T, throwIfMissing: boolean | null | undefined): T | null {
        if (elem == null) { return null; }
        var attr = elem.attributes.getNamedItem(attrName);
        if (throwIfMissing && attr == null) {
            throw this._validator.missingAttribute(attrName, elem);
        }
        return attr != null ? parser(attr.value) : null;
    }


    public removeAttr(elem: HasAttributes, name: string) {
        if (elem) {
            elem.attributes.removeNamedItem(name);
        }
    }


    /** get multiple attributes from a Node and return them as an object */
    public getAttrs<K extends string>(elem: HasAttributes, attrNames: K[], skipNull?: boolean): { [P in K]: string | null } {
        var res = <{ [P in K]: string | null }>{};
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
    }


    // ==== .children ====

    public queryOneChild<T extends Element>(parent: NodeSelectorLike | T, selectors: string): T;
    public queryOneChild<T extends Element>(parent: NodeSelectorLike | T, selectors: string, throwIfNone?: boolean): T | null;
    public queryOneChild<T extends Element>(parent: NodeSelectorLike | T, selectors: string, throwIfNone: boolean = true): T | null {
        // NOTE: only newer browsers support this
        var res = parent.querySelector<T>(":scope > " + selectors);
        if (throwIfNone && res == null) {
            throw this._validator.missingNode(selectors, parent);
        }
        return res;
    }


    public queryOneAndGetChilds<T extends Element>(parent: NodeSelectorLike | T, selectors: string): T[] {
        var res = parent.querySelector<T>(selectors);
        if (!res) { throw this._validator.missingNode(selectors, parent); }
        var resAry = Array.prototype.slice.call(res.children);
        return resAry;
    }


    public queryAllChilds<T extends Element>(parent: NodeSelectorLike | T, selectors: string): T[] {
        // NOTE: only newer browsers support this
        return this.queryAll<T>(parent, ":scope > " + selectors);
    }


    public queryAll<T extends Element>(parent: NodeSelectorLike | T, selectors: string): T[] {
        var res = parent.querySelectorAll<T>(selectors);
        var resAry = Array.prototype.slice.call(res);
        return resAry;
    }


    public getChildNodes<T extends NodeLike>(elem: T): T[] {
        var resAry = Array.prototype.slice.call(elem.childNodes);
        return resAry;
    }


    public getChildren<T extends { children: HTMLCollectionBase }>(elem: T): Element[] {
        var resAry: Element[] = Array.prototype.slice.call(elem.children);
        return resAry;
    }


    public removeChilds(elem: Node): void {
        var lastChild: Node | null = null;
        while (lastChild = elem.lastChild) {
            elem.removeChild(lastChild);
        }
    }


    public addChilds(parent: NodeLike, childs: NodeLike[] | ArrayLike<NodeLike>): void {
        for (var i = 0, size = childs.length; i < size; i++) {
            parent.appendChild(childs[i]);
        }
    }

}