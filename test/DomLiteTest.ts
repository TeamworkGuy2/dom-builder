import chai = require("chai");
import DomLite = require("../dom/DomLite");

var asr = chai.assert;

suite("DomLite", function domLite() {
    var newAttr = DomLite.createAttribute;

    test("textNode", function textNodeTest() {
        var txt = DomLite.createTextNode("abc");
        asr.equal(txt.nodeValue, "abc");
        asr.isNull(txt.attributes);
        asr.throws(() => txt.appendChild(<any>null));

        var txt2 = txt.cloneNode();
        var txt3 = txt.cloneNode(true);
        txt.nodeValue = "123";
        asr.equal(txt.nodeValue, "123");
        asr.equal(txt2.nodeValue, "abc");
        asr.equal(txt3.nodeValue, "abc");
    });


    test("createElement/appendChild", function elementTest() {
        var elem = DomLite.createElement("div");
        asr.equal(elem.nodeName, "div");
        asr.equal(elem.childNodes.length, 0);

        var ch1 = DomLite.createElement("span");
        elem.appendChild(ch1);
        asr.equal(elem.childNodes.length, 1);

        var ch2 = DomLite.createElement("a");
        elem.appendChild(ch2);
        asr.equal(elem.childNodes.length, 2);
    });


    test("toString/XML/HTML", function toStringTest() {
        var elem = DomLite.createElement("section");
        elem.textContent = "abc";
        asr.equal(elem.toString(), "<section>abc</section>");

        var ch1 = DomLite.createElement("div");
        var chch1 = DomLite.createElement("span");
        chch1.textContent = "nested";
        ch1.appendChild(chch1);
        elem.appendChild(ch1);
        var txt1 = DomLite.createTextNode("end!");
        elem.appendChild(txt1);

        asr.equal(elem.toString(), "<section>abc<div><span>nested</span></div>end!</section>");
        asr.equal(elem.toString("  "),
            "<section>abc\n" +
            "  <div>\n" +
            "    <span>nested</span>\n" +
            "  </div>\n" +
            "end!\n" +
            "</section>");
    });


    test("classList", function classListTest() {
        var el = DomLite.createElement("div");
        var cl = el.classList;
        cl.add("class-1");
        cl.add("class-2", "class-3");
        asr.equal(cl.join(" "), "class-1 class-2 class-3");

        cl.toggle("custom-A");
        asr.equal(cl.join(" "), "class-1 class-2 class-3 custom-A");
        cl.toggle("custom-A");
        asr.equal(cl.join(" "), "class-1 class-2 class-3");

        asr.isFalse(cl.contains("custom-A"));
        cl.toggle("custom-A", false);
        asr.equal(cl.join(" "), "class-1 class-2 class-3");
        cl.toggle("custom-A", true);
        asr.equal(cl.join(" "), "class-1 class-2 class-3 custom-A");
        cl.toggle("custom-A");
        asr.isFalse(cl.contains("custom-A"));
        asr.equal(cl.length, 3);
        cl.remove("class-2");
        asr.equal(cl.length, 2);
        asr.equal(cl.item(1), "class-3");
        asr.equal(cl.item(0), "class-1");
    });


    test("cssStyles", function cssStylesTest() {
        var el = DomLite.createElement("div");
        var st = el.style;
        st.zIndex = "123";
        st.backgroundColor = "#999";
        asr.equal(st.length, 2);
        asr.deepEqual(Object.keys(st).map((k) => st[<number><any>k]), ["123", "#999"]);
        asr.equal(st.zIndex, "123");
        asr.equal(st.item(1), "#999");
    });


    test("attributes", function attributesTest() {
        var el = DomLite.createElement("div");
        var attrs = el.attributes;
        var attr1 = newAttr("a1", 123);
        asr.isNull(attrs.getNamedItem("a1"));
        attrs.setNamedItem(attr1);
        asr.equal(attrs.item(0), attr1);
        asr.equal(attrs.getNamedItem("a1"), attr1);

        var attr2 = newAttr("a2", "abc");
        attrs.setNamedItemNS(attr2);
        asr.equal(attrs.length, 2);
        asr.isNotNull(attrs.removeNamedItem("a1"));
        asr.equal(attrs[0], attr2);
    });


    test("attributes enumerable", function attributesEnumerableTest() {
        var attr1 = newAttr("a1", 123);
        var attr2 = newAttr("a2", "abc");

        var attrs = DomLite.createNamedNodeMap();
        attrs.setNamedItem(attr1);
        attrs.setNamedItem(attr2);

        var el = DomLite.createElement("div");
        el.attributes.setNamedItem(attr1);
        el.attributes.setNamedItem(attr2);
        asr.deepEqual(Object.keys(el.attributes), ["0", "1"]);
    });


    test("document-like", function documentLikeTest() {
        var doc = new DomLite.DocLike("zzz://some.url/a/path/", "sheet");
        var r1 = doc.createElement("row");
        var r2 = r1.cloneNode(true);
        var c11 = doc.createElement("cell");
        r1.appendChild(c11);
        var c21 = doc.createElement("cell");
        var c22 = c21.cloneNode(true);
        r2.appendChild(c21);
        r2.appendChild(c22);
        doc.doc.appendChild(r1);
        doc.doc.appendChild(r2);

        c11.textContent = "abc";
        c11.attributes.setNamedItem(newAttr("ref", "r1c1"));
        c21.attributes.setNamedItem(newAttr("ref", "r2c1"));
        c22.attributes.setNamedItem(newAttr("ref", "r2c2"));
        c22.attributes.setNamedItem(newAttr("type", 122));

        asr.equal((<AttributeLike>c11.attributes.getNamedItem("ref")).value, "r1c1");
        asr.equal((<AttributeLike>c21.attributes.item(0)).value, "r2c1");
        asr.equal((<AttributeLike>c22.attributes.getNamedItemNS(null, "ref")).value, "r2c2");

        asr.equal(doc.toString(),
            '<sheet xmlns="zzz://some.url/a/path/">' +
                '<row>' +
                    '<cell ref="r1c1">abc</cell>' +
                '</row>' +
                '<row>' +
                    '<cell ref="r2c1" />' +
                    '<cell ref="r2c2" type="122" />' +
                '</row>' +
            '</sheet>'
        );
    });

});