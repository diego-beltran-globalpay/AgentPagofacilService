"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsNameMappigns = void 0;
var ToDecodeTypes;
(function (ToDecodeTypes) {
    ToDecodeTypes["CardNumber"] = "Card";
    ToDecodeTypes["ExpirationDate"] = "ExpDate";
})(ToDecodeTypes || (ToDecodeTypes = {}));
exports.fieldsNameMappigns = {
    DataSource: {
        position: 0,
        name: "fieldNameSource",
        type: "string",
    },
    DataType: {
        position: 1,
        name: "fieldNameToDecode",
        type: "string",
    },
};
