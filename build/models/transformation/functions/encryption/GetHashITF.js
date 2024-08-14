"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsNameMappigns = void 0;
var HashTypes;
(function (HashTypes) {
    HashTypes["md5"] = "MD5";
    HashTypes["sha1"] = "SHA1";
    HashTypes["sha256"] = "SHA256";
    HashTypes["sha224"] = "SHA224";
    HashTypes["sha512"] = "SHA512";
    HashTypes["sha384"] = "SHA384";
    HashTypes["sha3"] = "SHA3";
    HashTypes["ripemd160"] = "RIPEMD160";
})(HashTypes || (HashTypes = {}));
exports.fieldsNameMappigns = {
    DataSource: {
        position: 0,
        name: "fieldNameSource",
        type: "string",
    },
    HashType: {
        position: 1,
        name: "hashType",
        type: "string",
    },
};
