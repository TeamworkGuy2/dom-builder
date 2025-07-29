
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

    styles(styles: { [name: string]: string | number | boolean | null | undefined }, skipNulls?: boolean): DomBuilder<T>;

    style(name: string, value: string | number | boolean | null | undefined, skipNull?: boolean): DomBuilder<T>;

    attrs(attrs: { [name: string]: string | number | boolean | null | undefined }, skipNulls?: boolean): DomBuilder<T>;
    attrs<U extends object>(attrs: U, skipNulls?: boolean): DomBuilder<T>;

    attr(name: string, value: string | number | boolean | null | undefined, skipNull?: boolean): DomBuilder<T>;

    attrBool(name: string, value: boolean | null | undefined, skipFalseOrNull?: boolean, trueVal?: string, falseVal?: string): DomBuilder<T>;

    attrInt(name: string, value: number | null | undefined, skipNull?: boolean): DomBuilder<T>;

    attrFloat(name: string, value: number | null | undefined, skipNull?: boolean): DomBuilder<T>;

    attrString(name: string, value: string | null | undefined, skipEmptyOrNull?: boolean): DomBuilder<T>;

    text(textContent: string | number | boolean): DomBuilder<T>;

    addChild<S extends Element>(elems: S | S[] | DomBuilder<S> | DomBuilder<S>[]): DomBuilder<T>;
    addChild<S extends ElementLike>(elems: S | S[] | DomBuilder<S> | DomBuilder<S>[]): DomBuilder<T>;

    textOrChild(textOrElem: string | number | boolean | ElementLike): DomBuilder<T>;

    onEvent(eventName: string, handler: (evt: Event) => any, useCapture?: boolean): DomBuilder<T>;
}


/** Factory for creating various HTMLElement instances and returning the HTMLElement wrapped in a new DomBuilder instance
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

    /** Returns a singleton created by calling the global 'DOMParser' constructor */
    getParser(): DOMParser;

    /** Returns a singleton created by calling the global 'XMLSerializer' constructor */
    getSerializer(): XMLSerializer;

    // ==== Element.attributes utils ====
    attrInt(elem: ElementLike, name: string, val?: number, throwIfMissing?: boolean): number | null;

    attrFloat(elem: ElementLike, name: string, val?: number, throwIfMissing?: boolean): number | null;

    attrBool(elem: ElementLike, name: string, val?: boolean, skipSetFalse?: boolean, throwIfMissing?: boolean): boolean | null;

    attrString(elem: ElementLike, name: string, val?: string, skipSetEmpty?: boolean, throwIfMissing?: boolean): string | null;

    // ==== Get attributes from Node ====
    getAttrInt(elem: HasAttributes, attrName: string, defaultValue?: number, throwIfMissing?: boolean): number | null;

    getAttrFloat(elem: HasAttributes, attrName: string, defaultValue?: number, throwIfMissing?: boolean): number | null;

    getAttrBool(elem: HasAttributes, attrName: string, defaultValue?: boolean, throwIfMissing?: boolean): boolean | null;

    getAttrString(elem: HasAttributes, attrName: string, defaultValue?: string, throwIfMissing?: boolean): string | null;

    removeAttr(elem: HasAttributes, name: string): void;

    /** Reads the 'attrNames' attributes from 'elem' and returns an map of those attribute names to their values.
     * @param elem an object with an 'attributes' property with a 'getNamedItem()' function to read the attributes from
     * @param attrNames the attribute names to retrieve
     * @param skipNull optional, flag to skip null attributes in the returned map
     * @returns map of attribute names to their values
     */
    getAttrs<K extends string>(elem: HasAttributes, attrNames: K[], skipNull?: boolean): { [P in K]: string | null };

    // ==== .children ====
    /** Call 'querySelector()' to retrieve one immediate child element matching the selector.
     * @param parent the parent element
     * @param selectors the CSS/querySelector() selector
     * @param throwIfNone optional (default: true), throw an error if no matching child element is found
     * @returns one element matching the query selector, null if 'throwIfNone' is false else throws an error when no match is found
     */
    queryOneChild<T extends Element>(parent: NodeSelectorLike | T, selectors: string): T;
    queryOneChild<T extends Element>(parent: NodeSelectorLike | T, selectors: string, throwIfNone: true): T;
    queryOneChild<T extends Element>(parent: NodeSelectorLike | T, selectors: string, throwIfNone?: boolean): T | null;

    /** Call 'querySelector()' to retrive one child element matching the selector.
     * @param parent the parent element
     * @param selectors the CSS/querySelector() selector
     * @returns one the 'children' of the first element matched by the query selector, else throws an error if no match is found
     */
    queryOneAndGetChilds<T extends Element>(parent: NodeSelectorLike | T, selectors: string): T[];

    /** Call 'querySelectorAll()' to retrive immediate child elements matching the selector.
     * @param parent the parent element
     * @param selectors the CSS/querySelectorAll() selector
     * @return immediate matching elements of the 'parent'
     */
    queryAllChilds<T extends Element>(parent: NodeSelectorLike | T, selectors: string): T[];

    /** Call 'querySelectorAll()' to retrive any child elements matching the selector.
     * @param parent the parent element
     * @param selectors the CSS/querySelectorAll() selector
     * @return matching elements
     */
    queryAll<T extends Element>(parent: NodeSelectorLike | T, selectors: string): T[];

    /** Get the 'childNodes' from an element and copy them to an array
     * @param elem the element from which to retrieve 'childNodes'
     * @returns array of child nodes
     */
    getChildNodes<T extends NodeLike>(elem: T): T[];

    /** Get the 'children' from an element and copy them to an array
     * @param elem the element from which to retrieve 'children'
     * @returns array of children
     */
    getChildren<T extends { children: HTMLCollectionBase }>(elem: T): Element[];

    /** Remove all of the children from a node by looping over 'lastChild' and calling 'removeChild()'
     * @param elem the element to remove children from
     */
    removeChilds(elem: Node): void;

    /** Add children to an element
     * @param parent the parent element to add the children to
     * @param childs the child elements to add
     */
    addChilds(parent: NodeLike, childs: NodeLike[] | ArrayLike<NodeLike>): void;
}


/** Check that DOM nodes match expected formats and handling/throwing errors if not
 * @author TeamworkGuy2
 * @since 2016-04-27
 */
interface DomValidate {
    missingNode(nodeName: string, parent?: any | null): Error;

    missingAttribute(attributeName: string, parent?: any | null): Error;

    expectNode(node: Element, expectedNodeName?: string, parentNodeName?: string, idx?: number, size?: number): void;

    unexpectedNode(badNodeName: string, expectedNodeName?: string, parentNodeName?: string, idx?: number, size?: number): Error;
}

/**
 * Basic functionality of a DOM {@link Attr}.
 */
interface AttributeLike {
    readonly name: string;
    value: string;
    readonly localName?: string;
    readonly namespaceURI?: string | null;
    readonly prefix?: string | null;
}


interface HasAttributes {
    attributes: NamedNodeMapLike;
}

/** Basic functions for creating DOM elements and attributes, like {@link Document}.
 */
interface DocumentLike {
    /** The document's content type */
    readonly contentType: string;
    /** Reference to the root node of the document */
    readonly documentElement: ElementLike;

    lookupNamespaceURI(prefix: string | null): string | null;

    createAttribute(name: string): AttributeLike;
    createAttributeNS(namespaceURI: string | null, qualifiedName: string): AttributeLike;

    createElement(tagName: string): ElementLike;

    createElementNS(namespaceURI: string | null, qualifiedName: string): ElementLike;

    createTextNode(data: string): NodeLike;
}

/** Basic functionality of a DOM {@link Element}.
 */
interface ElementLike extends NodeLike {
    id: string;
    attributes: NamedNodeMapLike;
    namespaceURI?: string | null;
    classList?: DOMTokenList;
    style?: CSSStyleDeclaration;

    setAttribute(name: string, value: any): void;
    setAttributeNS(namespaceURI: string | null, qualifiedName: string, value: any): void;
}

/** Basic functionality of a {@link NamedNodeMap}.
 */
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

/** Basic functionality of a DOM {@link Node}.
 */
interface NodeLike {
    nodeName: string;
    nodeValue: string | null;
    readonly childNodes: NodeListLike;
    textContent: string | null;

    appendChild<T extends Node>(newChild: T): T;
    appendChild<T extends NodeLike>(newChild: T): T;

    removeChild<T extends Node>(oldChild: T): T;
    removeChild<T extends NodeLike>(oldChild: T): T;

    addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
}


interface NodeListLike {
    readonly length: number;
    [index: number]: NodeLike;

    item(index: number): NodeLike;
}


type NodeSelectorLike = Pick<ParentNode, "querySelector" | "querySelectorAll">;


declare module "dom-builder" {
    interface Validate extends DomValidate { }
    interface Builder<T extends ElementLike> extends DomBuilder<T> { }
    interface BuilderFactory extends DomBuilderFactory { }
    interface BuilderHelper extends DomBuilderHelper { }
}