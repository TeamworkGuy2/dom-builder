import { Builder } from "dom-builder";

/** A wrapper for a DOM element (similar to how a JQuery object wraps one or more DOM elements).
 * Exposes a builder pattern to reduce the code required to create and setup a new element for
 * insertion into a Document.
 * Includes functions to set the element's ID, add class names, add styles, set attributes,
 * set the element's text content, and add child elements.
 * Access the `element` property at any time to retrieve the underlying DOM element.
 * @author TeamworkGuy2
 * @since 2016-04-26
 */
export class DomBuilder<T extends ElementLike> implements Builder<T> {
    public element: T;
    public dom: DocumentLike;
    private attributeNamespaceHandler: ((elem: T, qualifiedName: string) => string | null) | undefined;


    constructor(elem: T, dom: DocumentLike, attributeNamespaceHandler: ((elem: T, qualifiedName: string) => string | null) | undefined) {
        this.element = elem;
        this.dom = dom;
        this.attributeNamespaceHandler = attributeNamespaceHandler;
    }


    public classes(classNames: string | (string | null)[] | null | undefined): this {
        var clsList = this.element.classList;
        if (Array.isArray(classNames)) {
            for (var i = 0, size = classNames.length; i < size; i++) {
                var clsName = classNames[i];
                if (clsName != null) {
                    (clsList as DOMTokenList).add(clsName);
                }
            }
        }
        else if (classNames != null) {
            (clsList as DOMTokenList).add(classNames);
        }
        return this;
    }


    public id(id: string | null | undefined): this {
        if (id != null) {
            this.element.id = id;
        }
        return this;
    }


    public styles(styles: { [name: string]: string | number | boolean | null | undefined } | null | undefined, skipNulls?: boolean): this {
        var elemStyle = this.element.style;

        if (styles != null) {
            var keys = Object.keys(styles);
            for (var i = 0, size = keys.length; i < size; i++) {
                var style = styles[keys[i]];
                if (!skipNulls || style != null) {
                    (elemStyle as CSSStyleDeclaration)[keys[i] as any] = style as string;
                }
            }
        }
        return this;
    }


    public style(name: string, value: string | number | boolean | null | undefined, skipNull?: boolean): this {
        if (!skipNull || value != null) {
            (this.element.style as CSSStyleDeclaration)[name as any] = (value ? String(value) : value) as string;
        }
        return this;
    }


    public attrs(attrs: { [name: string]: string | number | boolean | null | undefined }, skipNulls?: boolean): this;
    public attrs<U extends object>(attrs: U, skipNulls?: boolean): this;
    public attrs(attrs: any, skipNulls?: boolean): this {
        var elem = this.element;

        if (attrs) {
            var attrsMap: { [name: string]: string | number | boolean | null | undefined } = attrs;
            for (var key in attrsMap) {
                var attrVal = attrsMap[key];
                if (Object.prototype.hasOwnProperty.call(attrsMap, key) && (!skipNulls || attrVal != null)) {
                    elem.setAttribute(key, attrVal);
                }
            }
        }
        return this;
    }


    public attr(name: string, value: string | number | boolean | null | undefined, skipNull?: boolean): this {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    }

    public attrBool(name: string, value: boolean | null | undefined, skipFalseOrNull?: boolean, trueVal?: string, falseVal?: string): this {
        return this._attr(name, skipFalseOrNull && (value == null || value == false) ? null : value === true ? (trueVal !== undefined ? trueVal : "true") : (falseVal !== undefined ? falseVal : "false"), skipFalseOrNull);
    }

    public attrInt(name: string, value: number | null | undefined, skipNull?: boolean): this {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    }

    public attrFloat(name: string, value: number | null | undefined, skipNull?: boolean): this {
        return this._attr(name, skipNull && value == null ? null : String(value), skipNull);
    }

    public attrString(name: string, value: string | null | undefined, skipEmptyOrNull?: boolean): this {
        return this._attr(name, skipEmptyOrNull && (value == null || value.length === 0) ? null : value, skipEmptyOrNull);
    }

    /**
     * Sets an attribute on this element. Attribute names with namespace prefixes
     * are passed to the {@link attributeNamespaceHandler} to pick a namespace.
     * If `attributeNamespaceHandler` returns a namespace it will be used to call `setAttributeNS()`,
     * otherwise `setAttribute()` is called.
     * @param name the name of the attribute the set
     * @param value the value to set, null and undefined have no effect if `skipNull`
     * is true. Setting the attribute is skipped and this function returns.
     * If `skipNull` is fales or not provided, then null values are set.
     * @param skipNull (optional) (default: false) true to skip
     * setting the attribute if the `value` is null or undefined.
     * @returns this DomBuilder instance
     */
    private _attr(name: string, value: string | null | undefined, skipNull?: boolean): this {
        if (!skipNull || value != null) {
            let namespaceUri: string | undefined | null = null;
            var colonIdx = name.indexOf(':');
            if (colonIdx > 0) {
                namespaceUri = this.attributeNamespaceHandler?.(this.element, name);
            }

            if (namespaceUri != null) {
                this.element.setAttributeNS(namespaceUri, name, value);
            }
            else {
                this.element.setAttribute(name, value);
            }
        }
        return this;
    }


    public text(textContent: string | number | boolean | null | undefined): this {
        this.element.textContent = (textContent ? String(textContent) : textContent) as string;
        return this;
    }


    public addChild<S extends ElementLike>(elems: S | S[] | Builder<S> | Builder<S>[]): this {
        if (Array.isArray(elems)) {
            for (var i = 0, size = elems.length; i < size; i++) {
                var el = elems[i];
                this.element.appendChild(DomBuilder.isDomBuilder(el) ? el.element : el);
            }
        }
        else if (elems) {
            this.element.appendChild(DomBuilder.isDomBuilder(elems) ? elems.element : elems);
        }
        return this;
    }


    public textOrChild(textOrElem: string | number | boolean | ElementLike): this {
        if ((textOrElem as ElementLike).nodeName) {
            this.addChild(textOrElem as ElementLike);
        }
        else {
            this.text(textOrElem as string | number | boolean);
        }
        return this;
    }


    public onEvent(eventName: string, handler: (evt: Event) => any, useCapture: boolean = false): this {
        this.element.addEventListener(eventName, handler, useCapture);
        return this;
    }


    private static isDomBuilder<S extends ElementLike>(elem: S | Builder<S>): elem is Builder<S> {
        return (elem as Builder<S>).textOrChild !== undefined && (elem as Builder<S>).attr !== undefined;
    }


    public static newInst<U extends ElementLike>(
        elem: U,
        dom: DocumentLike,
        attributeNamespaceHandler: ((elem: U, qualifiedName: string) => string | null) | undefined,
        id?: string,
        classes?: string | string[],
        styles?: { [name: string]: string | number },
    ) {
        var inst = new DomBuilder(elem, dom, attributeNamespaceHandler);
        inst.id(id).classes(classes).styles(styles);
        return inst;
    }

}