"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowFuncAvb = void 0;
const AutoReplyMessage_1 = require("./AutoReplyMessage");
const CallTo_1 = require("./CallTo");
const CloseConnection_1 = require("./CloseConnection");
const GoTo_1 = require("./GoTo");
const GoToAutoReply_1 = require("./GoToAutoReply");
const GoToError_1 = require("./GoToError");
const IgnoreMessage_1 = require("./IgnoreMessage");
const SetError_1 = require("./SetError");
const ForEach_1 = require("./ForEach");
const For_1 = require("./For");
const ForIn_1 = require("./ForIn");
const While_1 = require("./While");
const Sleep_1 = require("./Sleep");
const FinishRule_1 = require("./FinishRule");
exports.flowFuncAvb = {
    AutoReplyMessage: AutoReplyMessage_1.AutoReplyMessage,
    CallTo: CallTo_1.CallTo,
    CloseConnection: CloseConnection_1.CloseConnection,
    GoTo: GoTo_1.GoTo,
    GoToAutoReply: GoToAutoReply_1.GoToAutoReply,
    IgnoreMessage: IgnoreMessage_1.IgnoreMessage,
    SetError: SetError_1.SetError,
    ForEach: ForEach_1.ForEach,
    For: For_1.For,
    ForIn: ForIn_1.ForIn,
    While: While_1.While,
    Sleep: Sleep_1.Sleep,
    FinishRule: FinishRule_1.FinishRule,
    GoToError: GoToError_1.GoToError,
};
