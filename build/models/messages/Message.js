"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const uuid = __importStar(require("uuid"));
class Message {
    constructor(wildcard, messageID = uuid.v1()) {
        this.messageID = messageID;
        this.body = {};
        this.format = null;
        this.action = null;
        this.mainContextKey = null;
        this.altContextKey = null;
        this.groupID = "-1";
        this.transport = {};
        this.setFormat = (format) => {
            this.format = format;
        };
        if (wildcard instanceof Buffer) {
            this.rawBody = wildcard;
        }
        else {
            this.body = wildcard;
            this.rawBody = Buffer.from(JSON.stringify(wildcard), "utf-8");
        }
    }
}
exports.Message = Message;
