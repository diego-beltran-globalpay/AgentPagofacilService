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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMsgsBuilder = void 0;
const MsgsTesterCreatorFileType_1 = require("./files/MsgsTesterCreatorFileType");
const MsgsTesterCreatorFileType_validator_1 = __importDefault(require("./files/MsgsTesterCreatorFileType.validator"));
const Actions_1 = require("../../../models/messages/Actions");
const transformation_1 = require("../../../models/transformation");
class TestMsgsBuilder extends transformation_1.Transformation {
    constructor(opts) {
        super(opts);
    }
    validateFile(fileJSON) {
        return MsgsTesterCreatorFileType_validator_1.default(fileJSON);
    }
    fromClientToTarget(message, rule) {
        return this.transformMessage(message, MsgsTesterCreatorFileType_1.TesterDirectionsAvbEnum.ClientToTarget, rule);
    }
    fromTargetToClient(message, rule) {
        return this.transformMessage(message, MsgsTesterCreatorFileType_1.TesterDirectionsAvbEnum.TargetToClient, rule);
    }
    autoReply(message, rule) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.transformMessage(message, MsgsTesterCreatorFileType_1.TesterDirectionsAvbEnum.AutoReply, rule);
            return Object.assign(Object.assign({}, result), { action: Actions_1.MsgActions.autoReply });
        });
    }
}
exports.TestMsgsBuilder = TestMsgsBuilder;
