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
exports.Source2Target = void 0;
const Source2TargetITF_1 = require("./Source2TargetITF");
const Source2TargetITF_validator_1 = __importDefault(require("./Source2TargetITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class Source2Target extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            let { finalMessage: targetReference, initialMessage: clientReference } = contexts;
            const { initialRootElement, finalRootElement } = this.props;
            if (initialRootElement || finalRootElement) {
                this.logger.trace(`[ Source2Target ] - Copying fields from initialRootElement [${initialRootElement}] to finalRootElement [${finalRootElement}]`, {
                    logPrefix,
                });
                const elementsToGet = (initialRootElement || "").split(".");
                const elementsToCreate = (finalRootElement || "").split(".");
                for (const i in elementsToCreate) {
                    if (elementsToCreate[i] != "") {
                        if (targetReference[elementsToCreate[i]] === undefined)
                            targetReference[elementsToCreate[i]] = {};
                        targetReference = targetReference[elementsToCreate[i]];
                    }
                }
                for (const i in elementsToGet) {
                    if (clientReference[elementsToGet[i]] !== undefined)
                        clientReference = clientReference[elementsToGet[i]];
                    else
                        break;
                }
            }
            else {
                this.logger.debug("[ Source2Target ] - Coping source message into targetMessage", { logPrefix });
            }
            for (const fieldKey in clientReference)
                targetReference[fieldKey] = clientReference[fieldKey];
        });
    }
}
exports.Source2Target = Source2Target;
Source2Target.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, Source2TargetITF_1.fieldsNameMappigns, Source2TargetITF_validator_1.default);
    return new Source2Target(params);
};
