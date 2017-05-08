
/** A wrapper for an HTMLElement with chainable functions for manipulating the underlying HTMLElement.
 * For example, adding 'class' names the the element is just 'domBldr.class("...")'.
 * And once the HTMLElement is setup, use the 'element' property to retrieve it
 * @author TeamworkGuy2
 * @since 2016-04-25
 */
interface DomBuilder<T extends HTMLElement> {
    element: T;

    class(classNames: string | string[]): DomBuilder<T>;

    id(id: string): DomBuilder<T>;

    styles(styles: { [name: string]: string | number | boolean }, skipNulls?: boolean): DomBuilder<T>;

    style(name: string, value: string | number | boolean, skipNull?: boolean): DomBuilder<T>;

    attrs(attrs: { [name: string]: string | number | boolean }, skipNulls?: boolean): DomBuilder<T>;
    attrs<U extends {}>(attrs: U, skipNulls?: boolean): DomBuilder<T>;

    attr(name: string, value: string | number | boolean, skipNull?: boolean): DomBuilder<T>;

    attrBool(name: string, value: boolean, skipFalseOrNull?: boolean, trueVal?: string, falseVal?: string): DomBuilder<T>;

    attrInt(name: string, value: number, skipNull?: boolean): DomBuilder<T>;

    attrFloat(name: string, value: number, skipNull?: boolean): DomBuilder<T>;

    attrString(name: string, value: string, skipEmptyOrNull?: boolean): DomBuilder<T>;

    text(textContent: string | number | boolean): DomBuilder<T>;

    addChild<S extends HTMLElement>(elems: S | S[] | DomBuilder<S> | DomBuilder<S>[]): DomBuilder<T>;

    textOrChild(textOrElem: string | number | boolean | HTMLElement): DomBuilder<T>;

    onEvent(eventName: string, handler: (evt: Event) => any, useCapture?: boolean): DomBuilder<T>;
}




/** A utility for creating various HTMLElement instances and returning the HTMLElement wrapped in a new DomBuilder instance
 * @author TeamworkGuy2
 * @since 2016-04-26
 */
interface DomBuilderFactory {
    create<P extends keyof HTMLElementTagNameMap>(elemName: P): DomBuilder<HTMLElementTagNameMap[P]>;
    create(elemName: string, namespace?: string): DomBuilder<HTMLElement>;
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
    attrInt(attrs: NamedNodeMap, name: string, val?: number): number;

    attrFloat(attrs: NamedNodeMap, name: string, val?: number): number;

    attrBool(attrs: NamedNodeMap, name: string, val?: boolean): boolean;

    attrString(attrs: NamedNodeMap, name: string, val?: string): string;


    // ==== Get attributes from Node ====
    getNodeAttrInt(elem: Node, attrName: string, ifNullReturnNull?: boolean): number;

    getNodeAttrFloat(elem: Node, attrName: string, ifNullReturnNull?: boolean): number;

    getNodeAttrBool(elem: Node, attrName: string, ifNullReturnNull?: boolean): boolean;

    getNodeAttrString(elem: Node, attrName: string, ifNullReturnNull?: boolean): string;

    removeNodeAttr(elem: Node, name: string): void;

    getNodeAttrs<T>(elem: Node, attrNames: string[], skipNull?: boolean): T;

    // ==== .children ====
    queryOneChild<T extends Element>(parent: NodeSelector | T, selectors: string): T;

    queryOneAndGetChilds<T extends Element>(parent: NodeSelector | T, selectors: string): T[];

    queryAll<T extends Element>(parent: NodeSelector | T, selectors: string): T[];

    queryAllChilds<T extends Element>(parent: NodeSelector | T, selectors: string): T[];

    getChilds<T extends Node>(elem: T): T[];

    removeChilds(elem: Element): void;

    addChilds(parent: Element, childs: Element[] | ArrayLike<Element>): void;

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


declare module "dom-builder" {
    interface Validate extends DomValidate { }
    interface Builder<T extends HTMLElement> extends DomBuilder<T> { }
    interface BuilderFactory extends DomBuilderFactory { }
    interface BuilderHelper extends DomBuilderHelper { }
}