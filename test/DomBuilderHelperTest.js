"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var DomLite_1 = require("../dom/DomLite");
var DomBuilderFactory_1 = require("../dom/DomBuilderFactory");
var DomBuilderHelper_1 = require("../dom/DomBuilderHelper");
var asr = chai.assert;
suite("DomBuilderHelper", function domLite() {
    test("getAttrs", function getAttrsTest() {
        var dh = new DomBuilderHelper_1.DomBuilderHelper(null, null);
        var attributes = DomLite_1.DomLite.createNamedNodeMap([
            { name: "attr1", value: "A1" },
            { name: "attr2", value: "2" },
            { name: "type", value: "123" },
            { name: "b1", value: "true" },
            { name: "f1", value: "0" },
            { name: "i1", value: "1200" },
        ]);
        asr.deepEqual(dh.getAttrs({ attributes: attributes }, ["attr1", "attr2"]), { attr1: "A1", attr2: "2" });
    });
    test("getAttr*", function getAttrTest() {
        var dh = new DomBuilderHelper_1.DomBuilderHelper(null, null);
        var attributes = DomLite_1.DomLite.createNamedNodeMap([
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
        asr.deepEqual(dh.getAttrs({ attributes: attributes }, ["attr1", "attr2"]), { attr1: "A1", attr2: "2" });
        asr.equal(dh.getAttrBool({ attributes: attributes }, "b1"), true);
        asr.equal(dh.getAttrBool({ attributes: attributes }, "b2"), false);
        asr.equal(dh.getAttrFloat({ attributes: attributes }, "f1"), 0);
        asr.equal(dh.getAttrFloat({ attributes: attributes }, "f2"), 1.75);
        asr.equal(dh.getAttrInt({ attributes: attributes }, "i1"), 1200);
        asr.equal(dh.getAttrInt({ attributes: attributes }, "i2"), -5);
        asr.equal(dh.getAttrString({ attributes: attributes }, "attr1"), "A1");
        asr.equal(dh.getAttrString({ attributes: attributes }, "i2"), "-5");
        asr.equal(dh.getAttrBool({ attributes: attributes }, "null-end"), null);
        asr.equal(dh.getAttrBool({ attributes: attributes }, "null-end", false), false);
        asr.equal(dh.getAttrBool({ attributes: attributes }, "null-end", true), true);
        asr.equal(dh.getAttrFloat({ attributes: attributes }, "null-end", 2.3), 2.3);
        asr.equal(dh.getAttrInt({ attributes: attributes }, "null-end", 3), 3);
        asr.equal(dh.getAttrString({ attributes: attributes }, "null-end", ""), "");
        asr.throws(function () { return dh.getAttrBool({ attributes: attributes }, "null-end", undefined, true); });
        asr.throws(function () { return dh.getAttrInt({ attributes: attributes }, "null-end", undefined, true); });
    });
    test("addChilds/removeChilds", function addRemoveChilds() {
        var dh = new DomBuilderHelper_1.DomBuilderHelper(null, null);
        var creator = new DomBuilderFactory_1.DomBuilderFactory(new DomLite_1.DomLite.DocLike(null, "html", "text/html"));
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
        asr.equal(ul.childNodes[0], undefined);
        asr.equal(ul.firstChild, null);
        asr.equal(ul.lastChild, null);
    });
});
