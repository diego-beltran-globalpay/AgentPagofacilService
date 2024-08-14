"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Echo = void 0;
const controlMsgs_1 = require("../../../models/endpoints/controlMsgs");
class Echo extends controlMsgs_1.MsgCreator {
    constructor(transformation, directions, ruleName) {
        super();
        this.transformation = transformation;
        this.directions = directions;
        this.ruleName = ruleName;
    }
    get(startMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tmp = yield this.transformation.transformMessage(startMessage, this.directions.send, this.ruleName);
                const { result, transformed } = tmp;
                if (transformed) {
                    startMessage.body = result;
                    return startMessage;
                }
            }
            catch (err) {
                this.logger.trace(`There was an error trying to get the ECHO msg. Error: ${err}`);
            }
            return null;
        });
    }
    analize(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tmp = yield this.transformation.transformMessage(message, this.directions.rcv, this.ruleName);
                return { founded: tmp.transformed, msgResult: tmp.result };
            }
            catch (err) {
                this.logger.trace(`There was an error trying to get the ECHO msg. Error: ${err}`);
            }
            return { founded: false };
        });
    }
}
exports.Echo = Echo;
