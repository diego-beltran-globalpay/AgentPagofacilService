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
exports.MsgsTransformation = void 0;
const MsgsTransformFileType_1 = require("./files/MsgsTransformFileType");
const MsgsTransformFileType_validator_1 = __importDefault(require("./files/MsgsTransformFileType.validator"));
const AppPropsInstance_1 = require("../properties/AppPropsInstance");
const Actions_1 = require("../../models/messages/Actions");
const transformation_1 = require("../../models/transformation");
const encryption_1 = require("../../models/encryption");
class MsgsTransformation extends transformation_1.Transformation {
    constructor(opts) {
        super(opts);
    }
    static fromAppProperties(logPrefix) {
        const appProperties = AppPropsInstance_1.AppPropsInstance.getInstance();
        let rsaInstance = undefined;
        const { transformationUseEncryption } = appProperties.transformation;
        if (transformationUseEncryption) {
            const { transformationKSPrivFilePath, transformationKSPubFilePath, transformationKeysFormat, transformationKeyPassphrase, transformationKeysPadding, } = appProperties.transformation;
            rsaInstance = encryption_1.RSA.fromFiles(transformationKSPubFilePath, transformationKSPrivFilePath, transformationKeysFormat, transformationKeysPadding, transformationKeyPassphrase);
        }
        const { applyDefaultRule, transformFilePath, transformationReloadFileMode, transformationReloadFileInterval, transformationExtFunctionsFolderPath, } = appProperties.transformation;
        return new MsgsTransformation({
            transformFilePathList: transformFilePath.split(","),
            reloadFileMode: transformationReloadFileMode,
            applyDefaultRule,
            encryptionModule: rsaInstance,
            reloadFileInterval: transformationReloadFileInterval,
            extensionFunctionsFolderPath: transformationExtFunctionsFolderPath,
            logPrefix,
        });
    }
    validateFile(fileJSON) {
        return MsgsTransformFileType_validator_1.default(fileJSON);
    }
    fromClientToTarget(message, rule) {
        return this.transformMessage(message, MsgsTransformFileType_1.MsgsDirectionsAvbEnum.ClientToTarget, rule);
    }
    fromTargetToClient(message, rule) {
        return this.transformMessage(message, MsgsTransformFileType_1.MsgsDirectionsAvbEnum.TargetToClient, rule);
    }
    autoReply(message, rule) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.transformMessage(message, MsgsTransformFileType_1.MsgsDirectionsAvbEnum.AutoReply, rule);
            return Object.assign(Object.assign({}, result), { action: Actions_1.MsgActions.autoReply });
        });
    }
}
exports.MsgsTransformation = MsgsTransformation;
