import domBldr = require("dom-builder");

/** A wrapper for a DOM element (similar to how a JQuery object wraps one or more DOM elements).
 * Reduces the code required to create and setup a new element for insertion into a Document.
 * Includes functions to set the element's ID, add class names, add styles, set attributes, set the element's text content, and add child elements.
 * Access the 'element' property at any time to retrieve the underlying DOM element.
 * @author TeamworkGuy2
 * @since 2016-04-26
 */
class DomBuilder<T extends ElementLike, D extends DocumentLike> implements domBldr.Builder<T> {
    private elem: T;
    private dom: D;


    constructor(elem: T, dom: D) {
        this.elem = elem;
        this.dom = dom;
    }


    public get element() {
        return this.elem;
    }


    public get document() {
        return this.dom;
    }


    public classes(classNames: string | string[] | null | undefined): this {
        var clsList = this.elem.classList;
        if (Array.isArray(classNames)) {
            for (var i = 0, size = classNames.length; i < size; i++) {
                (<DOMTokenList>clsList).add(classNames[i]);
            }
        }
        else if (classNames != null) {
            (<DOMTokenList>clsList).add(classNames);
        }
        return this;
    }


    public id(id: string | null | undefined): this {
        if (id != null) {
            this.elem.id = id;
        }
        return this;
    }


    public styles(styles: { [name: string]: string | number | boolean } | null | undefined, skipNulls?: boolean): this {
        var elemStyle = this.elem.style;

        if (styles != null) {
            var keys = Object.keys(styles);
            for (var i = 0, size = keys.length; i < size; i++) {
                var style = styles[keys[i]];
                if (!skipNulls || style != null) {
                    (<CSSStyleDeclaration>elemStyle)[<number><any>keys[i]] = <string>style;
                }
            }
        }
        return this;
    }


    public style(name: string, value: string | number | boolean, skipNull?: boolean): this {
        if (!skipNull || value != null) {
            (<CSSStyleDeclaration>this.elem.style)[<number><any>name] = <string>(value ? String(value) : value);
        }
        return this;
    }


    public attrs(attrs: { [name: string]: string | number | boolean }, skipNulls?: boolean): this;
    public attrs<U extends object>(attrs: U, skipNulls?: boolean): this;
    public attrs(attrs: any, skipNulls?: boolean): this {
        var elemAttrs = <NamedNodeMapLike>this.elem.attributes;

        if (attrs) {
            var attrsMap = <{ [name: string]: string | number | boolean }>attrs;
            for (var key in attrsMap) {
                var attrVal = attrsMap[key];
                if (Object.prototype.hasOwnProperty.call(attrsMap, key) && (!skipNulls || attrVal != null)) {
                    var attr = this.dom.createAttribute(key);
                    attr.value = <string><any>attrVal;
                    elemAttrs.setNamedItem(attr);
                }
            }
        }
        return this;
    }


    public attr(name: string, value: string | number | boolean, skipNull?: boolean): this {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    }

    public attrBool(name: string, value: boolean, skipFalseOrNull?: boolean, trueVal?: string, falseVal?: string): this {
        return this._attr(name, skipFalseOrNull && (value == null || value == false) ? null : value === true ? (trueVal !== undefined ? trueVal : "true") : (falseVal !== undefined ? falseVal : "false"), skipFalseOrNull);
    }

    public attrInt(name: string, value: number, skipNull?: boolean): this {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    }

    public attrFloat(name: string, value: number, skipNull?: boolean): this {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    }

    public attrString(name: string, value: string, skipEmptyOrNull?: boolean): this {
        return this._attr(name, skipEmptyOrNull && (value == null || value.length === 0) ? null : value, skipEmptyOrNull);
    }

    private _attr(name: string, value: string | null, skipNull?: boolean): this {
        var elemAttrs = <NamedNodeMapLike>this.elem.attributes;
        if (!skipNull || value != null) {
            var nsIdx = name.indexOf(":");
            var attr = (nsIdx > -1 ? this.dom.createAttributeNS(name.substr(0, nsIdx), name) : this.dom.createAttribute(name));
            attr.value = <string>value;
            elemAttrs.setNamedItem(attr);
        }
        return this;
    }


    public text(textContent: string | number | boolean): this {
        this.elem.textContent = <string>(textContent ? String(textContent) : textContent);
        return this;
    }


    public addChild<S extends ElementLike>(elems: S | S[] | domBldr.Builder<S> | domBldr.Builder<S>[]): this {
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
    }


    public textOrChild(textOrElem: string | number | boolean | ElementLike): this {
        if ((<ElementLike>textOrElem).nodeName) {
            this.addChild(<ElementLike>textOrElem);
        }
        else {
            this.text(<string | number | boolean>textOrElem);
        }
        return this;
    }


    public onEvent(eventName: string, handler: (evt: Event) => any, useCapture: boolean = false): this {
        this.elem.addEventListener(eventName, handler, useCapture);
        return this;
    }


    private static isDomBuilder<S extends ElementLike, D extends DocumentLike>(elem: S | domBldr.Builder<S>): elem is domBldr.Builder<S> {
        return (<domBldr.Builder<S>>elem).textOrChild !== undefined && (<domBldr.Builder<S>>elem).attr !== undefined;
    }


    public static newInst<U extends ElementLike>(elem: U, dom: DocumentLike, id?: string, classes?: string | string[], styles?: { [name: string]: string | number }) {
        var inst = new DomBuilder(elem, dom);
        inst.id(id).classes(classes).styles(styles);
        return inst;
    }

}

export = DomBuilder;