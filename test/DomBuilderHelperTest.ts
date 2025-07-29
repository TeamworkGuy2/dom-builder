import * as chai from "chai";
import { DomLite } from "../dom/DomLite";
import { DomBuilderFactory } from "../dom/DomBuilderFactory";
import { DomBuilderHelper } from "../dom/DomBuilderHelper";

var asr = chai.assert;

suite("DomBuilderHelper", function domLite() {

    test("getAttrs", function getAttrsTest() {
        var dh = new DomBuilderHelper(<any>null, <any>null);
        var attributes = DomLite.createNamedNodeMap([
            { name: "attr1", value: "A1" },
            { name: "attr2", value: "2" },
            { name: "type", value: "123" },
            { name: "b1", value: "true" },
            { name: "f1", value: "0" },
            { name: "i1", value: "1200" },
        ]);

        asr.deepEqual(dh.getAttrs({ attributes }, ["attr1", "attr2"]), { attr1: "A1", attr2: "2" });
    });


    test("getAttr*", function getAttrTest() {
        var dh = new DomBuilderHelper(<any>null, <any>null);
        var attributes = DomLite.createNamedNodeMap([
            { name: "attr1", value: "A1" },
            { name: "attr2", value: "2" },
            { name: "type", value: "123" },
            { name: "b1", value: "true" },
            { name: "b2", value: "false" },
            { name: "f1", value: "0" },
            { name: "f2", value: "1.75" },
            { name: "i1", value: "1200" },
            { name: "i2", value: "-5" }
        ]);

        asr.deepEqual(dh.getAttrs({ attributes }, ["attr1", "attr2"]), { attr1: "A1", attr2: "2" });

        asr.equal(dh.getAttrBool({ attributes }, "b1"), true);
        asr.equal(dh.getAttrBool({ attributes }, "b2"), false);
        asr.equal(dh.getAttrFloat({ attributes }, "f1"), 0);
        asr.equal(dh.getAttrFloat({ attributes }, "f2"), 1.75);
        asr.equal(dh.getAttrInt({ attributes }, "i1"), 1200);
        asr.equal(dh.getAttrInt({ attributes }, "i2"), -5);
        asr.equal(dh.getAttrString({ attributes }, "attr1"), "A1");
        asr.equal(dh.getAttrString({ attributes }, "i2"), "-5");
        asr.equal(dh.getAttrBool({ attributes }, "null-end"), null);
        asr.equal(dh.getAttrBool({ attributes }, "null-end", false), false);
        asr.equal(dh.getAttrBool({ attributes }, "null-end", true), true);
        asr.equal(dh.getAttrFloat({ attributes }, "null-end", 2.3), 2.3);
        asr.equal(dh.getAttrInt({ attributes }, "null-end", 3), 3);
        asr.equal(dh.getAttrString({ attributes }, "null-end", ""), "");

        asr.throws(() => dh.getAttrBool({ attributes }, "null-end", undefined, true));
        asr.throws(() => dh.getAttrInt({ attributes }, "null-end", undefined, true));
    });


    test("addChilds/removeChilds", function addRemoveChilds() {
        var dh = new DomBuilderHelper(<any>null, <any>null);
        var creator = new DomBuilderFactory(new DomLite.DocLike(null, "html", "text/html"));

        var ul = creator.create("ul").element;
        var lis = [
            creator.create("li").element,
            creator.create("li").element,
            creator.create("li").element,
        ];

        dh.addChilds(ul, lis);

        asr.equal(ul.childNodes.length, 3);
        asr.equal(ul.childNodes[0], lis[0]);
        asr.equal(ul.childNodes[1], lis[1]);
        asr.equal(ul.childNodes[2], lis[2]);
        asr.equal(ul.firstChild, lis[0]);
        asr.equal(ul.lastChild, lis[2]);

        dh.removeChilds(ul);

        asr.equal(ul.childNodes.length, 0);
        asr.equal(ul.childNodes[0], <any>undefined);
        asr.equal(ul.firstChild, null);
        asr.equal(ul.lastChild, null);
    });

});