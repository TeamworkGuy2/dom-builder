"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var JSDom = require("jsdom");
var DomBuilderFactory_1 = require("../dom/DomBuilderFactory");
var DomLite_1 = require("../dom/DomLite");
var asr = chai.assert;
suite("DomBuilder", function domBuilder() {
    test("create", function createTest() {
        var dom = new JSDom.JSDOM("<?xml version=\"1.0\"?>\n<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\"></sst>", { contentType: "text/xml" }).window.document;
        var domBldr = new DomBuilderFactory_1.DomBuilderFactory(dom);
        var elem = domBldr.create('s', "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
            .attr('id', 'test')
            .element;
        dom.documentElement.appendChild(elem);
        asr.equal(dom.documentElement.outerHTML, '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
            '<s id="test"/>' +
            '</sst>');
    });
    test("create w/ lookupAndAddNamespace", function createWithNamespacesTest() {
        var dom = new JSDom.JSDOM("<?xml version=\"1.0\"?>\n<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\"></sst>", { contentType: "text/xml" }).window.document;
        var domBldr = new DomBuilderFactory_1.DomBuilderFactory(dom, null, function (elem, name) { return mockLookupAndAddNamespace(dom, elem, name); });
        // element with multiple attributes with namespaces to test the DomBuilderFactory's lookupAndAddNamespace()
        var elem = domBldr.create('s')
            .attrBool('xml:space', true, true, '1', '0')
            .attr('r:id', 'test')
            .element;
        dom.documentElement.appendChild(elem);
        asr.equal(dom.documentElement.outerHTML.replace(/ xmlns=""/g, ""), '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
            '<s xml:space="1" r:id="test"/>' +
            '</sst>');
    });
});
var namespaces = {
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "x14ac": "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac",
    "xr": "http://schemas.microsoft.com/office/spreadsheetml/2014/revision",
};
function mockLookupAndAddNamespace(document, element, qualifiedName) {
    var _a;
    var colonIdx = qualifiedName.indexOf(':');
    var namespaceUri = null;
    if (qualifiedName.startsWith('xml:')) {
        namespaceUri = DomLite_1.DomLite.XML_NAMESPACE;
    }
    if (namespaceUri == null) {
        namespaceUri = document.lookupNamespaceURI(qualifiedName.substring(0, colonIdx));
    }
    var documentElement = document.documentElement;
    var prefix = qualifiedName.substring(0, colonIdx);
    if (namespaceUri == null && prefix != null) {
        namespaceUri = namespaces[prefix];
        // If an OpenXML 'additional' namespace is used for an attribute, add it to the root of the document
        if (namespaceUri != null) {
            documentElement.setAttributeNS(DomLite_1.DomLite.XMLNS_NAMESPACE, "xmlns:".concat(prefix), namespaceUri);
        }
    }
    if (namespaceUri == null) {
        namespaceUri = (_a = element.namespaceURI) !== null && _a !== void 0 ? _a : null;
    }
    return namespaceUri;
}
