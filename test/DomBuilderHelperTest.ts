import chai = require("chai");
import DomLite = require("../dom/DomLite");
import DomBuilderHelper = require("../dom/DomBuilderHelper");

var asr = chai.assert;

suite("DomBuilderHelper", function domLite() {

    test("getNodeAttrs", function getNodeAttrsTest() {
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

        asr.deepEqual(dh.getNodeAttrs({ attributes }, ["attr1", "attr2"]), { attr1: "A1", attr2: "2" });

        asr.equal(dh.getNodeAttrBool({ attributes }, "b1"), true);
        asr.equal(dh.getNodeAttrBool({ attributes }, "b2"), false);
        asr.equal(dh.getNodeAttrFloat({ attributes }, "f1"), 0);
        asr.equal(dh.getNodeAttrFloat({ attributes }, "f2"), 1.75);
        asr.equal(dh.getNodeAttrInt({ attributes }, "i1"), 1200);
        asr.equal(dh.getNodeAttrInt({ attributes }, "i2"), -5);
        asr.equal(dh.getNodeAttrString({ attributes }, "attr1"), "A1");
        asr.equal(dh.getNodeAttrString({ attributes }, "i2"), "-5");
        asr.equal(dh.getNodeAttrBool({ attributes }, "null-end"), null);
        asr.equal(dh.getNodeAttrBool({ attributes }, "null-end", false), false);
        asr.equal(dh.getNodeAttrBool({ attributes }, "null-end", true), true);
        asr.equal(dh.getNodeAttrFloat({ attributes }, "null-end", 2.3), 2.3);
        asr.equal(dh.getNodeAttrInt({ attributes }, "null-end", 3), 3);
        asr.equal(dh.getNodeAttrString({ attributes }, "null-end", ""), "");
    });

});