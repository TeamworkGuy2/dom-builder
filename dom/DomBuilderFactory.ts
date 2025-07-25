﻿import { Builder, BuilderFactory } from "dom-builder";
import { DomBuilder } from "./DomBuilder";

/** A factory for creating DOM elements.
 * Includes methods for common DOM setup that requires a lot of native JS DOM code):
 * - converting multi-line text strings to DOM text nodes with <br>'s via toTextWithLineBreaks()
 * - creating an <a> link with a url and click handler in on function call via newLink()
 * - take a string OR an HTMLElement argument and determine the type, if it's an HTMLElement return it as-is,
 *     else create an element containing the string as content and return the new element via elementOrTextTo()
 * @author TeamworkGuy2
 * @since 2016-04-25
 */
export class DomBuilderFactory<D extends DocumentLike> implements BuilderFactory {
    private dom: DocumentLike;


    constructor(dom: Document | DocumentLike) {
        this.dom = dom;
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
        return DomBuilder.newInst(anchor, this.dom);
    }


    public create<P extends keyof HTMLElementTagNameMap>(elemName: P): Builder<HTMLElementTagNameMap[P]>;
    public create<T extends ElementLike>(elemName: string, namespace?: string): Builder<T> {
        var elem = namespace == null ? this.dom.createElement(elemName) : this.dom.createElementNS(namespace, elemName);
        return DomBuilder.newInst(elem, this.dom) as Builder<any>;
    }


    /**
     * @param textElementTypeName: i.e. 'span', 'div', 'p', etc.
     */
    public elementOrTextTo<E extends ElementLike>(textElementTypeName: string, textOrElem: string | E): E {
        if (typeof textOrElem === "string") {
            var elem = this.dom.createElement(textElementTypeName) as E;
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