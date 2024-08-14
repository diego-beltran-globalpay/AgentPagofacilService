"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsNameMappigns = exports.RelationalOperators = exports.Types = void 0;
var Types;
(function (Types) {
    Types["Binary"] = "binary";
    Types["Relational"] = "relational";
})(Types = exports.Types || (exports.Types = {}));
var RelationalOperators;
(function (RelationalOperators) {
    RelationalOperators["gt"] = "gt";
    RelationalOperators["gte"] = "gte";
    RelationalOperators["lt"] = "lt";
    RelationalOperators["lte"] = "lte";
    RelationalOperators["eq"] = "eq";
    RelationalOperators["neq"] = "neq";
})(RelationalOperators = exports.RelationalOperators || (exports.RelationalOperators = {}));
exports.fieldsNameMappigns = {
    EvalType: {
        position: 0,
        name: "type",
        type: "string",
    },
    OpType: {
        position: 1,
        name: "operation",
        type: "string",
    },
    DataSource: {
        position: 2,
        name: "fieldNameSource",
        type: "string",
    },
    DataSource2: {
        position: 3,
        name: "fieldNameAltSource",
        type: "string",
    },
    BitPosition: {
        position: 4,
        name: "bitPosition",
        type: "integer",
    },
};
