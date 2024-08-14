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
exports.DelFieldsWithPrefix = void 0;
const DelFieldsWithPrefixITF_1 = require("./DelFieldsWithPrefixITF");
const DelFieldsWithPrefixITF_validator_1 = __importDefault(require("./DelFieldsWithPrefixITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
class DelFieldsWithPrefix extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { source, prefix } = this.props;
            this.logger.debug(`[ DeleteFieldsWithPrefix ] - Deleting fields with prefix [${prefix}] from [${source}]`, { logPrefix });
            const elementsToDelete = (yield this.accessor.static.getReference(source, contexts));
            for (const name in elementsToDelete) {
                if (name.substr(0, prefix.length) === prefix) {
                    delete elementsToDelete[name];
                    this.logger.trace(`[ DeleteFieldsWithPrefix ] - Field [${name}] deleted.`, { logPrefix });
                }
            }
        });
    }
}
exports.DelFieldsWithPrefix = DelFieldsWithPrefix;
DelFieldsWithPrefix.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, DelFieldsWithPrefixITF_1.fieldsNameMappigns, DelFieldsWithPrefixITF_validator_1.default);
    return new DelFieldsWithPrefix(params);
};
