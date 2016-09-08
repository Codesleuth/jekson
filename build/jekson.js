"use strict";
/**
 * Modified version of the https://github.com/douglascrockford/JSON-js json_parse.js descent function.
 * All original credit to Douglas Crockford and json.org.
 */
class JeksonParser {
    constructor(source, projection) {
        this.projection = projection;
        this.escapee = {
            "\"": "\"",
            "\\": "\\",
            "/": "/",
            b: "\b",
            f: "\f",
            n: "\n",
            r: "\r",
            t: "\t"
        };
        this.text = source;
    }
    parse() {
        this.at = 0;
        this.ch = " ";
        const result = this.value();
        this.white();
        if (this.ch) {
            this.error("Syntax error");
        }
        return result;
    }
    next(c) {
        // If a c parameter is provided, verify that it matches the current character.
        if (c && c !== this.ch) {
            this.error("Expected '" + c + "' instead of '" + this.ch + "'");
        }
        // Get the next character. When there are no more characters,
        // return the empty string.
        this.ch = this.text.charAt(this.at);
        this.at += 1;
        return this.ch;
    }
    white() {
        // Skip whitespace.
        while (this.ch && this.ch <= " ") {
            this.next();
        }
    }
    object() {
        // Parse an object value.
        const obj = {};
        if (this.ch === "{") {
            this.next("{");
            this.white();
            if (this.ch === "}") {
                this.next("}");
                return obj; // empty object
            }
            while (this.ch) {
                const key = this.string();
                this.white();
                this.next(":");
                if (Object.hasOwnProperty.call(obj, key)) {
                    this.error("Duplicate key '" + key + "'");
                }
                if (this.projection.hasOwnProperty(key) && this.projection[key] === true) {
                    obj[key] = this.value();
                }
                else {
                    this.skip();
                }
                this.white();
                if (this.ch === "}") {
                    this.next("}");
                    return obj;
                }
                this.next(",");
                this.white();
            }
        }
        this.error("Bad object");
    }
    array() {
        // Parse an array value.
        const arr = [];
        if (this.ch === "[") {
            this.next("[");
            this.white();
            if (this.ch === "]") {
                this.next("]");
                return arr; // empty array
            }
            while (this.ch) {
                arr.push(this.value());
                this.white();
                if (this.ch === "]") {
                    this.next("]");
                    return arr;
                }
                this.next(",");
                this.white();
            }
        }
        this.error("Bad array");
    }
    string() {
        // Parse a string value.
        let value = "";
        // When parsing for string values, we must look for " and \ characters.
        if (this.ch === "\"") {
            while (this.next()) {
                if (this.ch === "\"") {
                    this.next();
                    return value;
                }
                if (this.ch === "\\") {
                    this.next();
                    if (this.ch === "u") {
                        let uffff = 0;
                        for (let _____i = 0; _____i < 4; _____i += 1) {
                            const hex = parseInt(this.next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        value += String.fromCharCode(uffff);
                    }
                    else if (typeof this.escapee[this.ch] === "string") {
                        value += this.escapee[this.ch];
                    }
                    else {
                        break;
                    }
                }
                else {
                    value += this.ch;
                }
            }
        }
        this.error("Bad string");
    }
    number() {
        // Parse a number value.
        let value;
        let string = "";
        if (this.ch === "-") {
            string = "-";
            this.next("-");
        }
        while (this.ch >= "0" && this.ch <= "9") {
            string += this.ch;
            this.next();
        }
        if (this.ch === ".") {
            string += ".";
            while (this.next() && this.ch >= "0" && this.ch <= "9") {
                string += this.ch;
            }
        }
        if (this.ch === "e" || this.ch === "E") {
            string += this.ch;
            this.next();
            if (this.ch === "-" || this.ch === "+") {
                string += this.ch;
                this.next();
            }
            while (this.ch >= "0" && this.ch <= "9") {
                string += this.ch;
                this.next();
            }
        }
        value = +string;
        if (!isFinite(value)) {
            this.error("Bad number");
        }
        else {
            return value;
        }
    }
    word() {
        // true, false, or null.
        switch (this.ch) {
            case "t":
                this.next("t");
                this.next("r");
                this.next("u");
                this.next("e");
                return true;
            case "f":
                this.next("f");
                this.next("a");
                this.next("l");
                this.next("s");
                this.next("e");
                return false;
            case "n":
                this.next("n");
                this.next("u");
                this.next("l");
                this.next("l");
                return null;
        }
        this.error("Unexpected '" + this.ch + "'");
    }
    error(m) {
        // Call error when something is wrong.
        throw {
            name: "SyntaxError",
            message: m,
            at: this.at,
            text: this.text
        };
    }
    value() {
        // Parse a JSON value. It could be an object, an array, a string, a number,
        // or a word.
        this.white();
        switch (this.ch) {
            case "{":
                return this.object();
            case "[":
                return this.array();
            case "\"":
                return this.string();
            case "-":
                return this.number();
            default:
                return (this.ch >= "0" && this.ch <= "9")
                    ? this.number()
                    : this.word();
        }
    }
    skip() {
        //TODO: Actually skip values. Cheat for now...
        this.value();
    }
}
function parse(source, projection) {
    const parser = new JeksonParser(source, projection);
    return parser.parse();
}
exports.parse = parse;
