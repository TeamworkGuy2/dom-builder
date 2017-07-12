
/** A wrapper for an HTMLElement with chainable functions for manipulating the underlying HTMLElement.
 * For example, adding 'class' names the the element is just 'domBldr.classes("...")'.
 * And once the HTMLElement is setup, use the 'element' property to retrieve it
 * @author TeamworkGuy2
 * @since 2016-04-25
 */
interface DomBuilder<T extends ElementLike> {
    element: T;

    classes(classNames: string | string[]): DomBuilder<T>;

    id(id: string): DomBuilder<T>;

    styles(styles: { [name: string]: string | number | boolean }, skipNulls?: boolean): DomBuilder<T>;

    style(name: string, value: string | number | boolean, skipNull?: boolean): DomBuilder<T>;

    attrs(attrs: { [name: string]: string | number | boolean }, skipNulls?: boolean): DomBuilder<T>;
    attrs<U extends object>(attrs: U, skipNulls?: boolean): DomBuilder<T>;

    attr(name: string, value: string | number | boolean, skipNull?: boolean): DomBuilder<T>;

    attrBool(name: string, value: boolean, skipFalseOrNull?: boolean, trueVal?: string, falseVal?: string): DomBuilder<T>;

    attrInt(name: string, value: number, skipNull?: boolean): DomBuilder<T>;

    attrFloat(name: string, value: number, skipNull?: boolean): DomBuilder<T>;

    attrString(name: string, value: string, skipEmptyOrNull?: boolean): DomBuilder<T>;

    text(textContent: string | number | boolean): DomBuilder<T>;

    addChild<S extends Element>(elems: S | S[] | DomBuilder<S> | DomBuilder<S>[]): DomBuilder<T>;
    addChild<S extends ElementLike>(elems: S | S[] | DomBuilder<S> | DomBuilder<S>[]): DomBuilder<T>;

    textOrChild(textOrElem: string | number | boolean | ElementLike): DomBuilder<T>;

    onEvent(eventName: string, handler: (evt: Event) => any, useCapture?: boolean): DomBuilder<T>;
}


/** A utility for creating various HTMLElement instances and returning the HTMLElement wrapped in a new DomBuilder instance
 * @author TeamworkGuy2
 * @since 2016-04-26
 */
interface DomBuilderFactory {
    create<P extends keyof HTMLElementTagNameMap>(elemName: P): DomBuilder<HTMLElementTagNameMap[P]>;
    create(elemName: string, namespace?: string): DomBuilder<ElementLike>;
}


/** Functions for handling XMLDocument objects:
 * - Getting/setting DOM element attributes
 * - Adding/removing DOM element children
 * - Querying (i.e. querySelector*()) children of DOM elements
 * @author TeamworkGuy2
 * @since 2016-04-27
 */
interface DomBuilderHelper {

    getParser(): DOMParser;

    getSerializer(): XMLSerializer;

    // ==== Element.attributes utils ====
    attrInt(attrs: NamedNodeMapLike, name: string, val?: number): number;

    attrFloat(attrs: NamedNodeMapLike, name: string, val?: number): number;

    attrBool(attrs: NamedNodeMapLike, name: string, val?: boolean): boolean;

    attrString(attrs: NamedNodeMapLike, name: string, val?: string): string;

    // ==== Get attributes from Node ====
    getNodeAttrInt(elem: HasAttributes, attrName: string, defaultValue?: number): number;

    getNodeAttrFloat(elem: HasAttributes, attrName: string, defaultValue?: number): number;

    getNodeAttrBool(elem: HasAttributes, attrName: string, defaultValue?: boolean): boolean;

    getNodeAttrString(elem: HasAttributes, attrName: string, defaultValue?: string): string;

    removeNodeAttr(elem: HasAttributes, name: string): void;

    getNodeAttrs<T extends object>(elem: HasAttributes, attrNames: (keyof T)[], skipNull?: boolean): T;

    // ==== .children ====
    queryOneChild<T extends Element>(parent: NodeSelector | T, selectors: string): T;

    queryOneAndGetChilds<T extends Element>(parent: NodeSelector | T, selectors: string): T[];

    queryAll<T extends Element>(parent: NodeSelector | T, selectors: string): T[];

    queryAllChilds<T extends Element>(parent: NodeSelector | T, selectors: string): T[];

    getChilds<T extends NodeLike>(elem: T): T[];

    removeChilds(elem: Element): void;

    addChilds(parent: ElementLike, childs: ElementLike[] | ArrayLike<ElementLike>): void;

}


/** Check that DOM nodes match expected formats and handling/throwing errors if not
 * @author TeamworkGuy2
 * @since 2016-04-27
 */
interface DomValidate {
    missingNode(nodeName: string);

    expectNode(node: Element, expectedNodeName?: string, parentNodeName?: string, idx?: number, size?: number);

    unexpectedNode(badNodeName: string, expectedNodeName?: string, parentNodeName?: string, idx?: number, size?: number);
}


interface AttributeLike {
    readonly name: string;
    value: string;
}


interface HasAttributes {
    attributes: NamedNodeMapLike;
}


interface DocumentLike {
    createAttribute(name: string): AttributeLike;
    createAttributeNS(namespaceURI: string | null, qualifiedName: string): { readonly name: string; value: string };

    createElement(tagName: string): ElementLike;

    createElementNS(namespaceURI: string | null, qualifiedName: string): ElementLike;

    createTextNode(data: string): NodeLike;
}


interface ElementLike extends NodeLike {
    id: string;
    classList?: DOMTokenList;
    style?: CSSStyleDeclaration;
}


interface NamedNodeMapLike {
    readonly length: number;
    [index: number]: AttributeLike;

    getNamedItem(name: string): AttributeLike;
    getNamedItemNS(namespaceURI: string | null, localName: string | null): AttributeLike;

    item(index: number): AttributeLike;

    removeNamedItem(name: string): AttributeLike;
    removeNamedItemNS(namespaceURI: string | null, localName: string | null): AttributeLike;

    setNamedItem(arg: AttributeLike): AttributeLike;
    setNamedItemNS(arg: AttributeLike): AttributeLike;
}


interface NodeLike {
    nodeName: string;
    nodeValue: string;
    attributes: NamedNodeMapLike;
    readonly childNodes: NodeListLike;
    textContent: string | null;

    appendChild<T extends Node>(newChild: T): T;
    appendChild<T extends NodeLike>(newChild: T): T;

    addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
}


interface NodeListLike {
    readonly length: number;
    [index: number]: NodeLike;

    item(index: number): NodeLike;
}


declare module "dom-builder" {
    interface Validate extends DomValidate { }
    interface Builder<T extends ElementLike> extends DomBuilder<T> { }
    interface BuilderFactory extends DomBuilderFactory { }
    interface BuilderHelper extends DomBuilderHelper { }
}