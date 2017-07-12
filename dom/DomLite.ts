
module DomLite {
    var EMPTY_LIST = <NodeListLike & NodeLike[]>Object.freeze(createNodeList());


    export function createElement(qualifiedName: string) {
        return new ElemLike(qualifiedName, null);
    }


    export function createTextNode(data: string) {
        return new TextNodeLike(data);
    }


    export function createAttribute(qualifiedName: string, value: string | number | boolean | null, namespaceUri?: string | null) {
        return new AttrLike(qualifiedName, value, namespaceUri);
    }



    export class AttrLike implements AttributeLike {
        name: string;
        value: string;
        ns: string;

        constructor(qualifiedName: string, value: string | number | boolean | null, namespaceUri?: string | null) {
            this.name = qualifiedName;
            this.value = "" + value;
            this.ns = namespaceUri || null;
        }

    }




    export class DocLike implements DocumentLike {
        doc: ElementLike;


        constructor(ns: string, rootNodeName: string) {
            this.doc = this.createElement(rootNodeName);
            if (ns != null) {
                this.doc.attributes.setNamedItem({ name: "xmlns", value: ns });
            }
        }


        public createAttribute(name: string) {
            return new AttrLike(name, null, null);
        }


        public createAttributeNS(namespaceUri: string | null, qualifiedName: string) {
            return new AttrLike(qualifiedName, null, namespaceUri);
        }


        public createElement(qualifiedName: string) {
            return new ElemLike(qualifiedName, null);
        }


        public createElementNS(namespaceUri: string | null, qualifiedName: string) {
            return new ElemLike(qualifiedName, namespaceUri);
        }


        public createTextNode(data: string) {
            var inst = new ElemLike(null, null);
            inst.nodeValue = data;
            return inst;
        }


        public toString() {
            return this.doc.toString();
        }

    }




    export class ElemLike implements ElementLike {
        id: string;
        nodeName: string;
        nodeValue: string;
        textContent: string | null;
        _attributes: NamedNodeMapLike & AttributeLike[];
        _childNodes: NodeListLike & NodeLike[];
        _classList?: DOMTokenList & string[];
        _style?: CSSStyleDeclaration;


        constructor(qualifiedName: string, namespaceUri: string) {
            this.nodeName = qualifiedName;
        }


        public get attributes() {
            return this._attributes || (this._attributes = createNamedNodeMap());
        }

        public get childNodes() {
            return this._childNodes || (this._childNodes = createNodeList());
        }

        public get classList() {
            return this._classList || (this._classList = createDomTokenList());
        }

        public get style() {
            return this._style || (this._style = <any>createCssStyle());
        }


        public appendChild<T extends NodeLike>(newChild: T): T {
            this._childNodes = this._childNodes || <any>createNodeList();
            this._childNodes.push(newChild);
            return newChild;
        }


        public addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
            // do nothing
        }


        public toString(indent?: string, currentIndent?: string) {
            var str = (currentIndent || "") + "<" + this.nodeName;
            var attrs: string[] = (this._attributes != null ? [] : null);
            for (var i = 0, size = this._attributes != null ? this._attributes.length : 0; i < size; i++) {
                var attr = this._attributes[i];
                attrs.push(attr.name + "=\"" + attr.value + "\"");
            }
            str += (attrs != null && attrs.length > 0 ? " " + attrs.join(" ") : "");

            var hasText = this.textContent != null && this.textContent.length > 0;
            size = this._childNodes != null ? this._childNodes.length : 0;

            str += (!hasText && size < 1 ? " />" : (">" + (hasText ? this.textContent : "")));

            for (var i = 0; i < size; i++) {
                str += (indent != null ? "\n" : "") + (<ElemLike>this._childNodes[i]).toString(indent, (indent != null ? (currentIndent ? currentIndent + indent : indent) : null));
            }
            if (hasText || size > 0) {
                if (indent != null && size > 0) {
                    str += "\n" + (currentIndent || "");
                }
                str += "</" + this.nodeName + ">";
            }

            return str;
        }


        public cloneNode(deep?: boolean) {
            var copy = new ElemLike(this.nodeName, null);
            copy.id = this.id;
            copy.nodeValue = this.nodeValue;
            copy.textContent = this.textContent;
            copy._attributes = (deep && this._attributes != null ? createNamedNodeMap(this._attributes) : null);
            copy._childNodes = (deep && this._childNodes != null ? createNodeList(this._childNodes, deep) : null);
            copy._classList = (deep && this._classList != null ? createDomTokenList(this._classList) : null);
            copy._style = (deep && this._style != null ? createCssStyle(this._style) : null);
            return copy;
        }

    }




    export class TextNodeLike implements NodeLike {
        nodeName: string;
        nodeValue: string;
        textContent: string | null;
        attributes: NamedNodeMapLike = null;
        childNodes = EMPTY_LIST;


        constructor(data: string) {
            this.nodeName = "#text";
            this.nodeValue = data;
        }


        public appendChild<T extends ElementLike>(newChild: T): T {
            throw new Error("Child nodes cannot be appended to a Text node");
        }


        public addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
            // do nothing
        }


        public toString() {
            return this.nodeValue;
        }


        public cloneNode(deep?: boolean) {
            return new TextNodeLike(this.nodeValue);
        }

    }



    export function createCssStyle(copy?: CSSStyleDeclaration): CSSStyleDeclaration {
        var inst: CSSStyleDeclaration = <any>(copy != null ? Object.assign({}, copy) : {});

        inst.getPropertyPriority = function getPropertyPriority(propertyName: string): string {
            // TODO ignores priority
            return "";
        };

        inst.getPropertyValue = function getPropertyValue(propertyName: string): string {
            return inst[propertyName];
        };

        inst.item = function item(index: number): string {
            // TODO efficient
            var keys = Object.keys(inst);
            return inst[keys[index]];
        };

        inst.removeProperty = function removeProperty(propertyName: string): string {
            var oldVal = inst[propertyName];
            delete inst[propertyName];
            return oldVal;
        };

        inst.setProperty = function setProperty(propertyName: string, value: string | null, priority?: string): void {
            // TODO ignores priority parameter
            inst[propertyName] = value;
        };

        return inst;
    }


    export function createNamedNodeMap(copy?: AttributeLike[]): NamedNodeMapLike & AttributeLike[] {
        var inst: NamedNodeMapLike & AttributeLike[] = <NamedNodeMapLike & AttributeLike[]><any[]>[];
        if (copy != null) {
            for (var k = 0, sz = copy.length; k < sz; k++) {
                inst.push({ name: copy[k].name, value: copy[k].value });
            }
        }

        inst.getNamedItem = function getNamedItem(name: string): AttributeLike {
            return inst.find((attr) => attr.name === name) || null;
        };

        inst.getNamedItemNS = function getNamedItemNS(namespaceURI: string | null, localName: string | null): AttributeLike {
            return inst.find((attr) => attr.name === localName) || null;
        };

        inst.item = function item(index: number): AttributeLike {
            return inst[index] || null;
        };

        inst.removeNamedItem = function removeNamedItem(name: string): AttributeLike {
            var idx = inst.findIndex((attr) => attr.name === name);
            if (idx > -1) {
                var attr = inst[idx];
                inst.splice(idx, 1);
                return attr;
            }
            return null;
        };

        inst.removeNamedItemNS = function removeNamedItemNS(namespaceURI: string | null, localName: string | null): AttributeLike {
            // TODO ignore namespace for now
            return inst.removeNamedItem(localName);
        };

        inst.setNamedItem = function setNamedItem(arg: AttributeLike): AttributeLike {
            var idx = inst.findIndex((attr) => attr.name === arg.name);
            if (idx === -1) {
                inst.push(arg);
            }
            else {
                inst[idx] = arg;
            }
            return arg;
        };

        inst.setNamedItemNS = function setNamedItemNS(arg: AttributeLike): AttributeLike {
            // TODO ignore namespace for now
            return inst.setNamedItem(arg);
        };

        return inst;
    }


    export function createNodeList(copy?: NodeLike[], deep?: boolean): NodeListLike & NodeLike[] {
        var inst: NodeListLike & NodeLike[] = <NodeListLike & NodeLike[]><any[]>[];
        if (copy != null) {
            for (var k = 0, sz = copy.length; k < sz; k++) {
                var elem = copy[k];
                inst.push((<any>elem).cloneNode != null ? (<any>elem).cloneNode(deep) : elem);
            }
        }

        inst.item = function item(index: number): NodeLike {
            return inst[index];
        };

        return inst;
    }


    export function createDomTokenList(copy?: string[]): DOMTokenList & string[] {
        var inst: DOMTokenList & string[] = <DOMTokenList & string[]><any[]>[];
        if (copy != null) {
            Array.prototype.push.apply(inst, copy);
        }

        inst.add = function add() {
            for (var i = 0, size = arguments.length; i < size; i++) {
                var argI = arguments[i];
                // only add if not already contained in list
                var idx = inst.indexOf(argI);
                if (idx === -1) {
                    inst.push(argI);
                }
            }
        };

        inst.contains = function contains(token: string): boolean {
            return inst.indexOf(token) > -1;
        };

        inst.item = function item(index: number): string {
            return inst[index];
        };

        inst.remove = function remove(...token: string[]): void {
            for (var i = 0, size = arguments.length; i < size; i++) {
                var idx = inst.indexOf(arguments[i]);
                if (idx > -1) {
                    inst.splice(idx, 1);
                    return; // only remove first instance
                }
            }
        };

        inst.toString = function toString(): string {
            return inst.toString();
        };

        inst.toggle = function toggle(token: string, force?: boolean): boolean {
            if (force !== undefined) {
                if (force) {
                    inst.add(token);
                    return true;
                }
                else {
                    inst.remove(token);
                    return false;
                }
            }
            else {
                if (inst.indexOf(token) > -1) {
                    inst.remove(token);
                    return false;
                }
                else {
                    inst.push(token);
                    return true;
                }
            }
        };

        return inst;
    }

}

export = DomLite;