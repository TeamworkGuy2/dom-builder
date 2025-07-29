import { Builder, BuilderFactory } from "dom-builder";
import { DomBuilder } from "./DomBuilder";

/** A factory for creating DOM elements.
 * Includes helpers for common DOM elements that requires a lot of native JS DOM code:
 * - {@link newLink} creating an <a> link with a url and click handler in on function call
 * - {@link elementOrTextTo} take a string OR an HTMLElement argument and determine the type,
 *    if it's an HTMLElement return it as-is, else create an element containing the string as content and
 *    return the new element
 * - {@link toTextWithLineBreaks} converting multi-line text strings to DOM text nodes with <br>'s
 * @author TeamworkGuy2
 * @since 2016-04-25
 */
export class DomBuilderFactory implements BuilderFactory {
    private dom: DocumentLike;
    private namespaceURI: string | null;
    private attributeNamespaceHandler: ((elem: ElementLike, qualifiedName: string) => string | null) | undefined;

    /**
     * Create a factory based on the given 'dom'
     * @param dom a {@link Document} or {@link DocumentLike} that this factory will be based on
     * @param namespaceURI optional namespace to assign to elements created by this factory.
     * If this is provided, elements will be created using `dom.createElementNS()`.
     * @param attributeNamespaceHandler optional handler to lookup and handle namespaces for attributes
     * set with prefixed qualified names
     */
    constructor(
        dom: Document | DocumentLike,
        namespaceURI?: string | null,
        attributeNamespaceHandler?: ((elem: ElementLike, qualifiedName: string) => string | null) | undefined
    ) {
        this.dom = dom;
        this.namespaceURI = namespaceURI || null;
        this.attributeNamespaceHandler = attributeNamespaceHandler;
    }

    /** Create an HTML <a> element
     */
    public newLink(doc: Document, displayText: string, url: string, clickHandler?: (evt: MouseEvent) => any): Builder<HTMLAnchorElement> {
        var anchor = doc.createElement("a");
        anchor.text = displayText;
        anchor.href = url;
        if (clickHandler) {
            anchor.addEventListener("click", clickHandler);
        }
        return DomBuilder.newInst(anchor, this.dom, this.attributeNamespaceHandler);
    }

    public create<P extends keyof HTMLElementTagNameMap>(elemName: P): Builder<HTMLElementTagNameMap[P]>;
    public create<T extends ElementLike>(elemName: string, namespace?: string): Builder<T>;
    public create<T extends ElementLike>(elemName: string, namespace?: string): Builder<T> {
        var elem: ElementLike;
        if (namespace != null) {
            elem = this.dom.createElementNS(namespace, elemName);
        }
        else if (this.namespaceURI != null) {
            elem = this.dom.createElementNS(this.namespaceURI, elemName);
        }
        else {
            elem = this.dom.createElement(elemName);
        }
        return DomBuilder.newInst(elem, this.dom, this.attributeNamespaceHandler) as Builder<any>;
    }

    /**
     * @param textElementTypeName: i.e. 'span', 'div', 'p', etc.
     */
    public elementOrTextTo<E extends ElementLike>(textElementTypeName: string, textOrElem: string | E): E {
        if (typeof textOrElem === "string") {
            var elem: E;
            if (this.namespaceURI != null) {
                elem = this.dom.createElementNS(this.namespaceURI, textElementTypeName) as E;
            }
            else {
                elem = this.dom.createElement(textElementTypeName) as E;
            }
            elem.textContent = textOrElem;
            return elem;
        }
        else {
            return textOrElem;
        }
    }

    /** Transform an array of strings into an array of DOM nodes with <br> elements between each line
     */
    public toTextWithLineBreaks(lines: string[]): NodeLike[] {
        var lineElems: NodeLike[] = [];
        for (var i = 0, size = lines.length; i < size; i++) {
            var line = lines[i];
            if (line.endsWith("<br/>")) {
                line = line.substr(0, line.length - 5);
            }
            if (line.endsWith("<br>")) {
                line = line.substr(0, line.length - 4);
            }
            lineElems.push(this.dom.createTextNode(line));
            lineElems.push(this.dom.createElement("br"));
        }
        return lineElems;
    }
}