import domBldr = require("dom-builder");

/** A wrapper for a DOM element (similar to how a JQuery object wraps one or more DOM elements).
 * Reduces the code required to create and setup a new element for insertion into the DOM.
 * Includes functions to set the element's ID, add class names, add styles, set attributes, set the element's text content, or add child elements.
 * Access the 'element' property at any time to retrieve the underlying DOM element.
 * @author TeamworkGuy2
 * @since 2016-04-26
 */
class DomBuilder<T extends HTMLElement> implements domBldr.Builder<T> {
    private elem: T;
    private dom: Document;


    constructor(elem: T, dom: Document) {
        this.elem = elem;
        this.dom = dom;
    }


    public get element() {
        return this.elem;
    }


    public get document() {
        return this.dom;
    }


    public class(classNames: string | string[]) {
        var clsList = this.elem.classList;
        if (Array.isArray(classNames)) {
            for (var i = 0, size = classNames.length; i < size; i++) {
                clsList.add(classNames[i]);
            }
        }
        else if (classNames) {
            clsList.add(classNames);
        }
        return this;
    }


    public id(id: string) {
        if (id) {
            this.elem.id = id;
        }
        return this;
    }


    public styles(styles: { [name: string]: string | number | boolean }, skipNulls?: boolean): DomBuilder<T> {
        var elemStyle = this.elem.style;

        if (styles) {
            var keys = Object.keys(styles);
            for (var i = 0, size = keys.length; i < size; i++) {
                var style = styles[keys[i]];
                if (!skipNulls || style != null) {
                    elemStyle[keys[i]] = style;
                }
            }
        }
        return this;
    }


    public style(name: string, value: string | number | boolean, skipNull?: boolean): DomBuilder<T> {
        if (!skipNull || value != null) {
            this.elem.style[name] = value ? String(value) : value;
        }
        return this;
    }


    public attrs(attrs: { [name: string]: string | number | boolean }, skipNulls?: boolean): DomBuilder<T>;
    public attrs<U extends {}>(attrs: U, skipNulls?: boolean): DomBuilder<T>;
    public attrs(attrs: any, skipNulls?: boolean): DomBuilder<T> {
        var elemAttrs = this.elem.attributes;

        if (attrs) {
            var attrsMap = <{ [name: string]: string | number | boolean }>attrs;
            var keys = Object.keys(attrsMap);
            for (var i = 0, size = keys.length; i < size; i++) {
                var attrVal = attrsMap[keys[i]];
                if (!skipNulls || attrVal != null) {
                    var attr = this.dom.createAttribute(keys[i]);
                    attr.value = <string><any>attrVal;
                    elemAttrs.setNamedItem(attr);
                }
            }
        }
        return this;
    }


    public attr(name: string, value: string | number | boolean, skipNull?: boolean): DomBuilder<T> {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    }

    public attrBool(name: string, value: boolean, skipFalseOrNull?: boolean, trueVal?: string, falseVal?: string): DomBuilder<T> {
        return this._attr(name, skipFalseOrNull && (value == null || value == false) ? null : value === true ? (trueVal !== undefined ? trueVal : "true") : (falseVal !== undefined ? falseVal : "false"), skipFalseOrNull);
    }

    public attrInt(name: string, value: number, skipNull?: boolean): DomBuilder<T> {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    }

    public attrFloat(name: string, value: number, skipNull?: boolean): DomBuilder<T> {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    }

    public attrString(name: string, value: string, skipEmptyOrNull?: boolean): DomBuilder<T> {
        return this._attr(name, skipEmptyOrNull && (value == null || value.length === 0) ? null : value, skipEmptyOrNull);
    }

    private _attr(name: string, value: string, skipNull?: boolean): DomBuilder<T> {
        var elemAttrs = this.elem.attributes;
        if (!skipNull || value != null) {
            var attr = this.dom.createAttribute(name);
            attr.value = value;
            elemAttrs.setNamedItem(attr);
        }
        return this;
    }


    public text(textContent: string | number | boolean) {
        this.elem.textContent = <string>(textContent ? String(textContent) : textContent);
        return this;
    }


    public addChild<S extends HTMLElement>(elems: S | S[] | DomBuilder<S> | DomBuilder<S>[]) {
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


    public textOrChild(textOrElem: string | number | boolean | HTMLElement) {
        var type = typeof textOrElem;
        if ((<HTMLElement>textOrElem).nodeType) {
            this.addChild(<HTMLElement>textOrElem);
        }
        else {
            this.text(<string | number | boolean>textOrElem);
        }
        return this;
    }


    public onEvent(eventName: string, handler: (evt: Event) => any, useCapture: boolean = false) {
        this.elem.addEventListener(eventName, handler, useCapture);
        return this;
    }


    private static isDomBuilder<S extends HTMLElement>(elem: S | DomBuilder<S>): elem is DomBuilder<S> {
        return (<DomBuilder<S>>elem).textOrChild !== undefined && (<DomBuilder<S>>elem).attr !== undefined;
    }


    public static newInst<U extends HTMLElement>(elem: U, dom: Document, id?: string, classes?: string | string[], styles?: { [name: string]: string | number }) {
        var inst = new DomBuilder(elem, dom);
        inst.id(id).class(classes).styles(styles);
        return inst;
    }

}

export = DomBuilder;