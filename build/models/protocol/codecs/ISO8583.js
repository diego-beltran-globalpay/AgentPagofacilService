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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISO8583 = void 0;
const fs_1 = __importDefault(require("fs"));
const FormatterModel_1 = require("./FormatterModel");
let iso8583wrapper;
class ISO8583 extends FormatterModel_1.FormatterModel {
    constructor(configFilePath) {
        super();
        this.bufferDecode = (input) => {
            const inputString = input.toString("hex");
            const array = this.handler.Decode(inputString, this.getLengthToDecode(inputString.length, "hex"));
            return this.convertArrayToObject(array);
        };
        this.paddIndex = (fieldNum) => "000".substr(fieldNum.toString().length) + fieldNum.toString();
        this.getLengthToDecode = (length, encoding) => (encoding === "hex" ? length * 2 : length);
        this.convertObjectToArray = (body) => Object.keys(body).reduce((messageArray, itemKey) => {
            const itemKeyNum = parseInt(itemKey);
            if (isNaN(itemKeyNum))
                throw new Error("A field received is not numeric.");
            messageArray[itemKeyNum] = body[itemKey];
            return messageArray;
        }, []);
        this.convertArrayToObject = (bodyArray) => bodyArray.reduce((message, item, index) => {
            message[this.paddIndex(index)] = item;
            return message;
        }, {});
        if (!fs_1.default.existsSync(configFilePath))
            throw new Error("ISO8583 config file is required! It was not found.");
        if (!iso8583wrapper)
            throw new Error(`You have to enable iso8583wrapper module first.`);
        this.handler = new iso8583wrapper.Iso8583Ops();
        this.handler.Create(configFilePath);
    }
    encode(message) {
        const { body, messageID } = message;
        const messageEncoded = this.handler.Encode(this.convertObjectToArray(body));
        this.logger.trace(`[ ISO8583 ][ Encode ] - Encoded message: [${messageEncoded}]`, { messageID });
        return Buffer.from(messageEncoded, "hex");
    }
}
exports.ISO8583 = ISO8583;
ISO8583.init = () => __awaiter(void 0, void 0, void 0, function* () {
    iso8583wrapper = !iso8583wrapper ? yield Promise.resolve().then(() => __importStar(require("@asap-technology/iso8583-wrapper"))) : iso8583wrapper;
});
