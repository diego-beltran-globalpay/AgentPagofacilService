"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfCtxAccessorInst = exports.TransfCtxAccessor = void 0;
const Accessor_1 = require("../../fields/Accessor");
const TransfCtxAccessorITF_1 = require("./TransfCtxAccessorITF");
class TransfCtxAccessor extends Accessor_1.Accessor {
}
exports.TransfCtxAccessor = TransfCtxAccessor;
class TransfCtxAccessorInst {
    static getInstance() {
        if (!this.instance) {
            this.instance = new TransfCtxAccessor(TransfCtxAccessorITF_1.TransfContextNameByRef, TransfCtxAccessorITF_1.DinTransfContextNameByRef);
        }
        return this.instance;
    }
}
exports.TransfCtxAccessorInst = TransfCtxAccessorInst;
