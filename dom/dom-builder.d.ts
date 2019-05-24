
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
    attrInt(elem: ElementLike, name: string, val?: number): number | null;

    attrFloat(elem: ElementLike, name: string, val?: number): number | null;

    attrBool(elem: ElementLike, name: string, val?: boolean): boolean | null;

    attrString(elem: ElementLike, name: string, val?: string): string | null;

    // ==== Get attributes from Node ====
    getNodeAttrInt(elem: HasAttributes, attrName: string, defaultValue?: number): number | null;

    getNodeAttrFloat(elem: HasAttributes, attrName: string, defaultValue?: number): number | null;

    getNodeAttrBool(elem: HasAttributes, attrName: string, defaultValue?: boolean): boolean | null;

    getNodeAttrString(elem: HasAttributes, attrName: string, defaultValue?: string): string | null;

    removeNodeAttr(elem: HasAttributes, name: string): void;

    getNodeAttrs<K extends string>(elem: HasAttributes, attrNames: K[], skipNull?: boolean): { [P in K]: string };
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
    missingNode(nodeName: string): void;

    expectNode(node: Element, expectedNodeName?: string, parentNodeName?: string, idx?: number, size?: number): void;

    unexpectedNode(badNodeName: string, expectedNodeName?: string, parentNodeName?: string, idx?: number, size?: number): void;
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
    createAttributeNS(namespaceURI: string | null, qualifiedName: string): AttributeLike;

    createElement(tagName: string): ElementLike;

    createElementNS(namespaceURI: string | null, qualifiedName: string): ElementLike;

    createTextNode(data: string): NodeLike;
}


interface ElementLike extends NodeLike {
    id: string;
    attributes: NamedNodeMapLike;
    classList?: DOMTokenList;
    style?: CSSStyleDeclaration;

    setAttribute(name: string, value: any): void;
    setAttributeNS(namespaceURI: string | null, qualifiedName: string, value: any): void;
}


interface NamedNodeMapLike {
    readonly length: number;
    [index: number]: AttributeLike;

    getNamedItem(name: string): AttributeLike | null;
    getNamedItemNS(namespaceURI: string | null, localName: string | null): AttributeLike | null;

    item(index: number): AttributeLike | null;

    removeNamedItem(name: string): AttributeLike | null;
    removeNamedItemNS(namespaceURI: string | null, localName: string | null): AttributeLike | null;

    setNamedItem(arg: AttributeLike): AttributeLike | null;
    setNamedItemNS(arg: AttributeLike): AttributeLike | null;
}


interface NodeLike {
    nodeName: string;
    nodeValue: string | null;
    readonly childNodes: NodeListLike;
    textContent: string | null;

    appendChild<T extends Node>(newChild: T): T;
    appendChild<T extends NodeLike>(newChild: T): T;

    addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
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