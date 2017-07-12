"use strict";
var DomBuilderImpl = require("./DomBuilder");
/** A factory for creating DOM elements.
 * Includes methods for common DOM setup that requires a lot of native JS DOM code):
 * - converting multi-line text strings to DOM text nodes with <br>'s via toTextWithLineBreaks()
 * - creating an <a> link with a url and click handler in on function call via newLink()
 * - take a string OR an HTMLElement argument and determine the type, if it's an HTMLElement return it as-is,
 *     else create an element containing the string as content and return the new element via elementOrTextTo()
 * @author TeamworkGuy2
 * @since 2016-04-25
 */
var DomBuilderFactory = (function () {
    function DomBuilderFactory(dom) {
        this.dom = dom;
    }
    /** Create an HTML <a> element
     */
    DomBuilderFactory.prototype.newLink = function (doc, displayText, url, clickHandler) {
        var anchor = doc.createElement("a");
        anchor.text = displayText;
        anchor.href = url;
        if (clickHandler) {
            anchor.addEventListener("click", clickHandler);
        }
        return DomBuilderImpl.newInst(anchor, this.dom);
    };
    DomBuilderFactory.prototype.create = function (elemName, namespace) {
        var elem = namespace == null ? this.dom.createElement(elemName) : this.dom.createElementNS(namespace, elemName);
        return DomBuilderImpl.newInst(elem, this.dom);
    };
    /**
     * @param textElementTypeName: i.e. 'span', 'div', 'p', etc.
     */
    DomBuilderFactory.prototype.elementOrTextTo = function (textElementTypeName, textOrElem) {
        if (typeof textOrElem === "string") {
            var elem = this.dom.createElement(textElementTypeName);
            elem.textContent = textOrElem;
            return elem;
        }
        else {
            return textOrElem;
        }
    };
    /** Transform an array of strings into an array of DOM nodes with <br> elements between each line
     */
    DomBuilderFactory.prototype.toTextWithLineBreaks = function (lines) {
        var lineElems = [];
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
    };
    return DomBuilderFactory;
}());
module.exports = DomBuilderFactory;
