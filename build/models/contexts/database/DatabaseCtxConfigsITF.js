"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStoredProcConfig = exports.isTablesConfig = exports.DbOpModes = void 0;
var DbOpModes;
(function (DbOpModes) {
    DbOpModes["KEY_VALUE"] = "keyValue";
    DbOpModes["FIELDS"] = "fields";
})(DbOpModes = exports.DbOpModes || (exports.DbOpModes = {}));
const isTablesConfig = (config) => {
    return !!config.idFieldName;
};
exports.isTablesConfig = isTablesConfig;
const isStoredProcConfig = (config) => {
    return !!config.insertStoreProcName;
};
exports.isStoredProcConfig = isStoredProcConfig;
