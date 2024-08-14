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
exports.DynamicAccessor = void 0;
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
const contexts_1 = require("../contexts");
const arraySyntaxReg = new RegExp(/(\w{1,60}(\[[0-9]{1,5}\]))/);
class DynamicAccessor {
    constructor(ctxsByPrefixRef) {
        this.ctxsByPrefixRef = ctxsByPrefixRef;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
    }
    isContextRef(prefix = "") {
        return Object.keys(this.ctxsByPrefixRef).some(value => prefix.substr(0, value.length) === value);
    }
    getReference(contextId, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield contexts_1.CtxsCollection.getInstance(contextId).getEntry(key);
            if (entry)
                return entry.data;
        });
    }
    getContext(contextId) {
        return contexts_1.CtxsCollection.getInstance(contextId);
    }
    replaceCtxValue(contextId, key, newElement) {
        return contexts_1.CtxsCollection.getInstance(contextId).addEntry(key, newElement);
    }
    get(parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prefix = parameter.substr(0, 2);
                const paramWithoutPrefix = parameter.substring(2);
                if (!this.isContextRef(prefix))
                    return parameter;
                const stepsNames = paramWithoutPrefix.split(".");
                if (stepsNames.length > 1) {
                    const [contextId, key, ...fieldNames] = stepsNames;
                    const reference = yield this.getReference(contextId, key);
                    if (reference === undefined)
                        return undefined;
                    // Analizamos si se tiene un campo compuesto (objetos)
                    let reference1 = DynamicAccessor.analizeArraySyntaxToGet(reference, fieldNames[0] == "*" ? Object.keys(reference)[0] : fieldNames[0]);
                    if (fieldNames.length === 1) {
                        return reference1;
                    }
                    else {
                        let i;
                        for (i = 1; i < fieldNames.length - 1; i++) {
                            reference1 = DynamicAccessor.analizeArraySyntaxToGet(reference1 || {}, fieldNames[i]);
                            if (reference1 === undefined)
                                return undefined;
                        }
                        return DynamicAccessor.analizeArraySyntaxToGet(reference1 || {}, fieldNames[i]);
                    }
                }
                else {
                    this.logger.error(`[ Get ] - Can not get the required field ${parameter}. Error: ContextID and ContextKey are required`);
                }
            }
            catch (error) {
                this.logger.error(`[ Get ] - Can not get the required field ${parameter}. Error: ${error}. Stack: ${error.stack}`);
                return undefined;
            }
        });
    }
    set(parameter, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = parameter.substr(0, 2);
            const paramWithoutPrefix = parameter.substring(2);
            if (this.isContextRef(prefix)) {
                const stepsNames = paramWithoutPrefix.split(".");
                if (stepsNames.length > 1) {
                    const [contextId, key, ...fieldNames] = stepsNames;
                    let reference = (yield this.getReference(contextId, key)) || {};
                    if (stepsNames.length === 2)
                        reference = value;
                    else
                        DynamicAccessor.setOrDeleteValue(reference, value, fieldNames, 0);
                    yield this.getContext(contextId).addEntry(key, reference);
                }
            }
        });
    }
    delete(parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = parameter.substr(0, 2);
            const paramWithoutPrefix = parameter.substring(2);
            if (this.isContextRef(prefix)) {
                const stepsNames = paramWithoutPrefix.split(".");
                const [contextId, key, ...fieldNames] = stepsNames;
                if (stepsNames.length == 2) {
                    yield this.getContext(contextId).deleteEntry(key);
                }
                else if (stepsNames.length > 2) {
                    const reference = yield this.getReference(contextId, key);
                    DynamicAccessor.setOrDeleteValue(reference, null, fieldNames, 0);
                    yield this.getContext(contextId).addEntry(key, reference);
                }
            }
        });
    }
    static analizeArraySyntaxToGet(reference, fieldName) {
        if (arraySyntaxReg.test(fieldName)) {
            const splitFieldName = fieldName.split("[");
            const newFieldName = splitFieldName[0];
            const arrayPosition = parseInt(splitFieldName[1].substr(0, splitFieldName[1].length - 1));
            return reference[newFieldName][arrayPosition];
        }
        else {
            if (fieldName === "*")
                fieldName = Object.keys(reference)[0];
            return reference[fieldName];
        }
    }
    static setOrDeleteValue(reference, valueToCreate, elementsToCreate, elementsPosition) {
        const arrayResult = DynamicAccessor.analizeArraySyntaxToSet(reference, elementsToCreate[elementsPosition]);
        if (elementsPosition + 1 === elementsToCreate.length) {
            if (valueToCreate !== undefined && valueToCreate !== null) {
                if (arrayResult[1] === undefined)
                    reference[elementsToCreate[elementsPosition]] = valueToCreate;
                else
                    arrayResult[0][arrayResult[1]] = valueToCreate;
            }
            else {
                if (arrayResult[1] === undefined)
                    delete reference[elementsToCreate[elementsPosition]];
                else
                    delete arrayResult[0][arrayResult[1]];
            }
        }
        else {
            if (arrayResult[1] !== undefined) {
                if (arrayResult[0][arrayResult[1]] === undefined)
                    arrayResult[0][arrayResult[1]] = {};
                DynamicAccessor.setOrDeleteValue(arrayResult[0][arrayResult[1]], valueToCreate, elementsToCreate, elementsPosition + 1);
            }
            else {
                DynamicAccessor.setOrDeleteValue(arrayResult[0], valueToCreate, elementsToCreate, elementsPosition + 1);
            }
        }
    }
    static analizeArraySyntaxToSet(reference, fieldName) {
        if (arraySyntaxReg.test(fieldName)) {
            const splitFieldName = fieldName.split("[");
            const newFieldName = splitFieldName[0];
            const arrayPosition = parseInt(splitFieldName[1].substr(0, splitFieldName[1].length - 1));
            if (reference[newFieldName] === undefined)
                reference[newFieldName] = [];
            return [reference[newFieldName], arrayPosition];
        }
        else {
            if (fieldName === "*")
                fieldName = Object.keys(reference)[0];
            if (reference[fieldName] === undefined)
                reference[fieldName] = {};
            return [reference[fieldName]];
        }
    }
}
exports.DynamicAccessor = DynamicAccessor;
