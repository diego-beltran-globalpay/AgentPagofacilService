"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsNameMappigns = exports.BcdTypes = void 0;
var BcdTypes;
(function (BcdTypes) {
    BcdTypes["Bigendian"] = "Bigendian";
    BcdTypes["Littlendian"] = "Littlendian";
})(BcdTypes = exports.BcdTypes || (exports.BcdTypes = {}));
exports.fieldsNameMappigns = {
    DataSource: {
        position: 0,
        name: "fieldNameSource",
        type: "string",
    },
    Type: {
        position: 1,
        name: "type",
        type: "string",
    },
};
