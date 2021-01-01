
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
        ns: string | null;

        constructor(qualifiedName: string, value: string | number | boolean | null, namespaceUri?: string | null) {
            this.name = qualifiedName;
            this.value = "" + value;
            this.ns = namespaceUri || null;
        }

    }




    export class DocLike implements DocumentLike {
        doc: ElementLike;


        constructor(ns: string | null, rootNodeName: string) {
            this.doc = this.createElement(rootNodeName);
            if (ns != null) {
                (<NamedNodeMapLike>this.doc.attributes).setNamedItem({ name: "xmlns", value: ns });
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
            var inst = new ElemLike(<string><any>null, null);
            inst.nodeValue = data;
            return inst;
        }


        public toString() {
            return this.doc.toString();
        }

    }




    export class ElemLike implements ElementLike {
        id: string = "";
        nodeName: string;
        nodeValue: string | null = null;
        textContent: string | null = null;
        firstChild: NodeLike | null = null;
        lastChild: NodeLike | null = null;
        _attributes: (NamedNodeMapLike & AttributeLike[]) | null = null;
        _childNodes: (NodeListLike & NodeLike[]) | null = null;
        _classList?: (DOMTokenList & string[]) | null;
        _style?: CSSStyleDeclaration | null;


        constructor(qualifiedName: string, namespaceUri?: string | null) {
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
            return this._style || (this._style = createCssStyle());
        }


        public appendChild<T extends NodeLike>(newChild: T): T {
            var childs = this._childNodes = this._childNodes || createNodeList();
            childs.push(newChild);
            if (childs.length === 1) {
                this.firstChild = newChild;
            }
            this.lastChild = newChild;
            return newChild;
        }


        public removeChild<T extends NodeLike>(oldChild: T): T {
            var childs = this._childNodes;
            var idx = childs?.indexOf(oldChild) ?? -1;

            if (childs != null && idx > -1) {
                // update childNodes
                removeIndex(childs, idx);
                // update firstChild/lastChild
                if (idx === childs.length) {
                    if (childs.length > 0) {
                        this.lastChild = childs[childs.length - 1];
                    }
                    else {
                        this.lastChild = null;
                        this.firstChild = null;
                    }
                }
                return oldChild;
            }
            throw new Error("The node to be removed is not a child of this node");
        }


        public addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
            // do nothing
        }


        public setAttribute(name: string, value: any): void {
            this.attributes.setNamedItem({ name, value });
        }


        public setAttributeNS(namespaceURI: string | null, qualifiedName: string, value: any): void {
            this.attributes.setNamedItem({ name: qualifiedName, value });
        }


        public toString(indent?: string, currentIndent?: string | null) {
            var str = (currentIndent || "") + "<" + this.nodeName;
            var attrs: string[] | null = (this._attributes != null ? [] : null);
            for (var i = 0, size = this._attributes != null ? this._attributes.length : 0; i < size; i++) {
                var attr = (<AttributeLike[]>this._attributes)[i];
                (<string[]>attrs).push(attr.name + "=\"" + attr.value + "\"");
            }
            str += (attrs != null && attrs.length > 0 ? " " + attrs.join(" ") : "");

            var hasText = this.textContent != null && this.textContent.length > 0;
            size = this._childNodes != null ? this._childNodes.length : 0;

            str += (!hasText && size < 1 ? " />" : (">" + (hasText ? this.textContent : "")));

            for (var i = 0; i < size; i++) {
                str += (indent != null ? "\n" : "") + (<ElemLike[]><any[]>this._childNodes)[i].toString(indent, (indent != null ? (currentIndent ? currentIndent + indent : indent) : null));
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
            copy.firstChild = copy._childNodes && copy._childNodes.length > 0 ? copy._childNodes[0] : null;
            copy.lastChild = copy._childNodes && copy._childNodes.length > 0 ? copy._childNodes[copy._childNodes.length - 1] : null;
            return copy;
        }

    }




    export class TextNodeLike implements NodeLike {
        nodeName: string;
        nodeValue: string | null;
        textContent: string | null = null;
        attributes: NamedNodeMapLike = <any>null;
        childNodes = EMPTY_LIST;


        constructor(data: string | null) {
            this.nodeName = "#text";
            this.nodeValue = data;
        }


        public appendChild<T extends ElementLike>(newChild: T): T {
            throw new Error("Child nodes cannot be appended to a Text node");
        }


        public removeChild<T extends ElementLike>(oldChild: T): T {
            throw new Error("Child nodes cannot be removed from a Text node");
        }


        public addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
            // do nothing
        }


        public toString() {
            return this.nodeValue || "";
        }


        public cloneNode(deep?: boolean) {
            return new TextNodeLike(this.nodeValue);
        }

    }



    export function createCssStyle(copy?: CSSStyleDeclaration): CSSStyleDeclaration {
        var inst: CSSStyleDeclaration = Object.create(copy != null ? Object.assign({}, copy) : {}, {
            getPropertyPriority: {
                value: function getPropertyPriority(propertyName: string): string {
                    // TODO ignores priority
                    return "";
                }
            },
            getPropertyValue: {
                value: function getPropertyValue(propertyName: string): string {
                    return inst[<number><any>propertyName];
                }
            },
            item: {
                value: function item(index: number): string {
                    // TODO inefficient
                    var keys = Object.keys(inst);
                    return inst[<number><any>keys[index]];
                }
            },
            length: {
                get: function get() {
                    // TODO inefficient
                    return Object.keys(inst).length;
                }
            },
            removeProperty: {
                value: function removeProperty(propertyName: string): string {
                    var oldVal = inst[<number><any>propertyName];
                    delete inst[<number><any>propertyName];
                    return oldVal;
                }
            },
            setProperty: {
                value: function setProperty(propertyName: string, value: string | null, priority?: string): void {
                    // TODO ignores priority parameter
                    inst[<number><any>propertyName] = <string>value;
                }
            },
        });

        return inst;
    }


    export function createNamedNodeMap(copy?: AttributeLike[]): NamedNodeMapLike & AttributeLike[] {
        var inst: NamedNodeMapLike & AttributeLike[] = <NamedNodeMapLike & AttributeLike[]><any[]>[];
        if (copy != null) {
            for (var k = 0, sz = copy.length; k < sz; k++) {
                inst.push({ name: copy[k].name, value: copy[k].value });
            }
        }

        Object.defineProperties(inst, {
            getNamedItem: {
                value: function getNamedItem(name: string): AttributeLike | null {
                    return inst.find((attr) => attr.name === name) || null;
                }
            },
            getNamedItemNS: {
                value: function getNamedItemNS(namespaceURI: string | null, localName: string | null): AttributeLike | null {
                    return inst.find((attr) => attr.name === localName) || null;
                }
            },
            item: {
                value: function item(index: number): AttributeLike | null {
                    return inst[index] || null;
                }
            },
            removeNamedItem: {
                value: function removeNamedItem(name: string | null): AttributeLike | null {
                    var idx = inst.findIndex((attr) => attr.name === name);
                    if (idx > -1) {
                        var attr = inst[idx];
                        inst.splice(idx, 1);
                        return attr;
                    }
                    return null;
                }
            },
            removeNamedItemNS: {
                value: function removeNamedItemNS(namespaceURI: string | null, localName: string | null): AttributeLike | null {
                    // TODO ignore namespace for now
                    return inst.removeNamedItem(<string>localName);
                }
            },
            setNamedItem: {
                value: function setNamedItem(arg: AttributeLike): AttributeLike {
                    var idx = inst.findIndex((attr) => attr.name === arg.name);
                    if (idx === -1) {
                        inst.push(arg);
                    }
                    else {
                        inst[idx] = arg;
                    }
                    return arg;
                }
            },
            setNamedItemNS: {
                value: function setNamedItemNS(arg: AttributeLike): AttributeLike | null {
                    // TODO ignore namespace for now
                    return inst.setNamedItem(arg);
                }
            },
        });

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

        Object.defineProperties(inst, {
            item: {
                value: function item(index: number): NodeLike {
                    return inst[index];
                }
            },
        });

        return inst;
    }


    export function createDomTokenList(copy?: string[]): DOMTokenList & string[] {
        var inst: DOMTokenList & string[] = <DOMTokenList & string[]><any[]>[];
        if (copy != null) {
            Array.prototype.push.apply(inst, copy);
        }

        Object.defineProperties(inst, {
            add: {
                value: function add() {
                    for (var i = 0, size = arguments.length; i < size; i++) {
                        var argI = arguments[i];
                        // only add if not already contained in list
                        var idx = inst.indexOf(argI);
                        if (idx === -1) {
                            inst.push(argI);
                        }
                    }
                }
            },
            contains: {
                value: function contains(token: string): boolean {
                    return inst.indexOf(token) > -1;
                }
            },
            item: {
                value: function item(index: number): string {
                    return inst[index];
                }
            },
            remove: {
                value: function remove(...token: string[]): void {
                    for (var i = 0, size = arguments.length; i < size; i++) {
                        var idx = inst.indexOf(arguments[i]);
                        if (idx > -1) {
                            inst.splice(idx, 1);
                            return; // only remove first instance
                        }
                    }
                }
            },
            toString: {
                value: function toString(): string {
                    return inst.toString();
                }
            },
            toggle: {
                value: function toggle(token: string, force?: boolean): boolean {
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
                }
            },
        });

        return inst;
    }


    // copied from 'ts-mortar@0.20.1'
    /** Remove an index from an array
     * For example: Arrays.removeIndex(["Alpha", "Beta", "Gamma"], 1)
     * returns: ["Alpha", "Gamma"]
     *
     * @param ary the array to remove an index from
     * @param index the index of the value to remove
     * @returns the 'ary' with the value at 'index' removed
     */
    function removeIndex<E>(ary: E[], index: number): E[];
    function removeIndex<E>(ary: E[] | null | undefined, index: number): E[] | null;
    function removeIndex<E>(ary: E[] | null | undefined, index: number): E[] | null {
        if (ary == null) { return null; }
        var size = ary.length;
        if (size < 1 || index < 0 || index >= size) { return ary; }

        for (var i = index + 1; i < size; i++) {
            ary[i - 1] = ary[i];
        }
        ary[size - 1] = <never>null;
        ary.length = size - 1;
        return ary;
    }

}

export = DomLite;