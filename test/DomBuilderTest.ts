import * as chai from "chai";
import * as JSDom from "jsdom";
import { DomBuilderFactory } from "../dom/DomBuilderFactory";
import { DomLite } from "../dom/DomLite";

var asr = chai.assert;

suite("DomBuilder", function domBuilder() {

    test("create", function createTest() {
        const dom = new JSDom.JSDOM(
            "<?xml version=\"1.0\"?>\n<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\"></sst>",
            { contentType: "text/xml" }
        ).window.document;
        const domBldr = new DomBuilderFactory(dom);
        const elem = domBldr.create('s', "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
            .attr('id', 'test')
            .element;
        dom.documentElement.appendChild(elem as any);

        asr.equal(dom.documentElement.outerHTML,
            '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
                '<s id="test"/>' +
            '</sst>'
        );
    });

    test("create w/ lookupAndAddNamespace", function createWithNamespacesTest() {
        const dom = new JSDom.JSDOM(
            "<?xml version=\"1.0\"?>\n<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\"></sst>",
            { contentType: "text/xml" }
        ).window.document;
        const domBldr = new DomBuilderFactory(dom, null, (elem, name) => mockLookupAndAddNamespace(dom, elem, name));
        // element with multiple attributes with namespaces to test the DomBuilderFactory's lookupAndAddNamespace()
        const elem = domBldr.create('s')
            .attrBool('xml:space', true, true, '1', '0')
            .attr('r:id', 'test')
            .element;
        dom.documentElement.appendChild(elem);

        asr.equal(dom.documentElement.outerHTML.replace(/ xmlns=""/g, ""),
            '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
                '<s xml:space="1" r:id="test"/>' +
            '</sst>'
        );
    });
});

const namespaces: Record<string, string> = {
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "x14ac": "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac",
    "xr": "http://schemas.microsoft.com/office/spreadsheetml/2014/revision",
};

function mockLookupAndAddNamespace(document: DocumentLike, element: ElementLike, qualifiedName: string): string | null {
    const colonIdx = qualifiedName.indexOf(':');
    let namespaceUri: string | null = null;
    if (qualifiedName.startsWith('xml:')) {
        namespaceUri = DomLite.XML_NAMESPACE;
    }
    if (namespaceUri == null) {
        namespaceUri = document.lookupNamespaceURI(qualifiedName.substring(0, colonIdx));
    }
    const documentElement = document.documentElement;
    const prefix = qualifiedName.substring(0, colonIdx);
    if (namespaceUri == null && prefix != null) {
        namespaceUri = namespaces[prefix];
        // If an OpenXML 'additional' namespace is used for an attribute, add it to the root of the document
        if (namespaceUri != null) {
            documentElement.setAttributeNS(DomLite.XMLNS_NAMESPACE, `xmlns:${prefix}`, namespaceUri);
        }
    }
    if (namespaceUri == null) {
        namespaceUri = element.namespaceURI ?? null;
    }
    return namespaceUri;
}
