"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterCtxAccessorInst = exports.RouterCtxAccessor = exports.TransfContextNameByRef = void 0;
const StaticAccessor_1 = require("../../models/fields/StaticAccessor");
var TransfContextNameByRef;
(function (TransfContextNameByRef) {
    TransfContextNameByRef["%S"] = "context";
})(TransfContextNameByRef = exports.TransfContextNameByRef || (exports.TransfContextNameByRef = {}));
class RouterCtxAccessor extends StaticAccessor_1.StaticAccessor {
}
exports.RouterCtxAccessor = RouterCtxAccessor;
class RouterCtxAccessorInst {
    static getInstance() {
        if (!this.instance) {
            this.instance = new RouterCtxAccessor(TransfContextNameByRef);
        }
        return this.instance;
    }
}
exports.RouterCtxAccessorInst = RouterCtxAccessorInst;
