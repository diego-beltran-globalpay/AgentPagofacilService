"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgKey = exports.msgKeyCreator = void 0;
const CleanedMsgKey_1 = require("./CleanedMsgKey");
const TransparentMsgKey_1 = require("./TransparentMsgKey");
const Iso8583MsgKey_1 = require("./Iso8583MsgKey");
exports.msgKeyCreator = {
    cleaned: CleanedMsgKey_1.CleanedMsgKey,
    transparent: TransparentMsgKey_1.TransparentMsgKey,
    iso: Iso8583MsgKey_1.Iso8583MsgKey,
};
class MsgKey {
    static create(type, fieldsNameList) {
        return new exports.msgKeyCreator[type](fieldsNameList);
    }
}
exports.MsgKey = MsgKey;
