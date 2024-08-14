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
exports.While = void 0;
const WhileITF_1 = require("./WhileITF");
const WhileITF_validator_1 = __importDefault(require("./WhileITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class While extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, ruleName } = this.props;
            this.logger.trace(`[ While ] - Executing a while loop using the field [${fieldNameSource}] as conditional`, { logPrefix });
            const conditionalSource = yield this.accessor.get(fieldNameSource, contexts);
            if (conditionalSource && conditionalSource instanceof Object && typeof conditionalSource.execAgain === "boolean") {
                contexts.registry.while = { ruleName, conditionalSource };
            }
            else {
                this.logger.error(`[ While ] - The field ${fieldNameSource} is not an object with a boolean property called 'execAgain' inside`, { logPrefix });
            }
        });
    }
}
exports.While = While;
While.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, WhileITF_1.fieldsNameMappigns, WhileITF_validator_1.default);
    return new While(params);
};
