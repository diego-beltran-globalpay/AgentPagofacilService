"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsNameMappigns = void 0;
var UuidTypes;
(function (UuidTypes) {
    UuidTypes["V1"] = "v1";
    UuidTypes["V4"] = "v4";
})(UuidTypes || (UuidTypes = {}));
exports.fieldsNameMappigns = {
    Version: {
        position: 0,
        name: "version",
        type: "string",
    },
};
