"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsNameMappigns = exports.TokenTypes = void 0;
var BufferEncoding;
(function (BufferEncoding) {
    BufferEncoding["ascii"] = "ascii";
    BufferEncoding["utf8"] = "utf8";
    BufferEncoding["utf16le"] = "utf16le";
    BufferEncoding["ucs2"] = "ucs2";
    BufferEncoding["base64"] = "base64";
    BufferEncoding["latin1"] = "latin1";
    BufferEncoding["binary"] = "binary";
    BufferEncoding["hex"] = "hex";
})(BufferEncoding || (BufferEncoding = {}));
var TokenTypes;
(function (TokenTypes) {
    TokenTypes["Zero"] = "0";
    TokenTypes["One"] = "1";
    TokenTypes["Two"] = "2";
    TokenTypes["Three"] = "3";
})(TokenTypes = exports.TokenTypes || (exports.TokenTypes = {}));
exports.fieldsNameMappigns = {
    ResultDest: {
        position: 0,
        name: "fieldNameDest",
        type: "string",
    },
    TokenType: {
        position: 1,
        name: "tokenType",
        type: "string",
    },
    Prefix: {
        position: 2,
        name: "prefix",
        type: "string",
    },
    SourceRef: {
        position: 3,
        name: "sourceRef",
        type: "string",
    },
    EncodingFrom: {
        position: 4,
        name: "convertFrom",
        type: "string",
    },
    EncodingTo: {
        position: 5,
        name: "convertTo",
        type: "string",
    },
    DelTokens: {
        position: 6,
        name: "deleteTokens",
        type: "boolean",
    },
};
