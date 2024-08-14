"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgActions = void 0;
var MsgActions;
(function (MsgActions) {
    MsgActions[MsgActions["send"] = 1] = "send";
    MsgActions[MsgActions["autoReply"] = 2] = "autoReply";
    MsgActions[MsgActions["ignoreMessage"] = 3] = "ignoreMessage";
    MsgActions[MsgActions["doNothing"] = 4] = "doNothing";
    MsgActions[MsgActions["closeConnection"] = 5] = "closeConnection";
})(MsgActions = exports.MsgActions || (exports.MsgActions = {}));
