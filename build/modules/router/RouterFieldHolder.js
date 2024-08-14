"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterFieldHolder = void 0;
const FieldHolder_1 = require("../../models/fields/FieldHolder");
const RouterCtxAccessor_1 = require("./RouterCtxAccessor");
class RouterFieldHolder extends FieldHolder_1.FieldHolder {
    get(context) {
        const value = RouterCtxAccessor_1.RouterCtxAccessorInst.getInstance().get(`%S${this.fieldName}`, context);
        switch (typeof value) {
            case "bigint":
            case "boolean":
            case "number":
            case "string":
                return value.toString().substr(this.start, this.length > 0 ? this.length : undefined);
            case "function":
            case "object":
            case "symbol":
            case "undefined":
                return undefined;
        }
    }
}
exports.RouterFieldHolder = RouterFieldHolder;
