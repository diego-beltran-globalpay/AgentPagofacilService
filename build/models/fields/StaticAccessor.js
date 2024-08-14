"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticAccessor = void 0;
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
const arraySyntaxReg = new RegExp(/(\w{1,60}(\[[0-9]{1,5}\]))/);
class StaticAccessor {
    constructor(ctxsByPrefixRef) {
        this.ctxsByPrefixRef = ctxsByPrefixRef;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
    }
    isContextRefStrict(prefix = "") {
        return Object.keys(this.ctxsByPrefixRef).some(value => prefix === value);
    }
    isContextRef(prefix = "") {
        return Object.keys(this.ctxsByPrefixRef).some(value => prefix.substr(0, value.length) === value);
    }
    getReference(reference, contexts) {
        return contexts[this.ctxsByPrefixRef[reference]];
    }
    replaceCtxValue(reference, contexts, newElement) {
        contexts[this.ctxsByPrefixRef[reference]] = newElement;
    }
    get(parameter, contexts) {
        try {
            const prefix = parameter.substr(0, 2);
            const fieldName = parameter.substring(2);
            if (!this.isContextRef(prefix))
                return parameter;
            const reference = this.getReference(prefix, contexts);
            // Analizamos si se tiene un campo compuesto (objetos)
            const fieldNames = fieldName.split(".");
            let reference1 = StaticAccessor.analizeArraySyntaxToGet(reference, fieldNames[0] == "*" ? Object.keys(reference)[0] : fieldNames[0]);
            if (fieldNames.length === 1) {
                return reference1;
            }
            else {
                let i;
                for (i = 1; i < fieldNames.length - 1; i++) {
                    reference1 = StaticAccessor.analizeArraySyntaxToGet(reference1 || {}, fieldNames[i]);
                    if (reference1 === undefined)
                        return undefined;
                }
                return StaticAccessor.analizeArraySyntaxToGet(reference1 || {}, fieldNames[i]);
            }
        }
        catch (error) {
            this.logger.error(`[ Get ] - Can not get the required field ${parameter}. Error: ${error}`);
            return undefined;
        }
    }
    set(parameter, value, contexts) {
        const prefix = parameter.substr(0, 2);
        let reference = contexts.finalMessage;
        if (this.isContextRef(prefix)) {
            reference = this.getReference(prefix, contexts);
            parameter = parameter.substr(2);
        }
        StaticAccessor.setOrDeleteValue(reference, value, parameter.split("."), 0);
    }
    delete(parameter, contexts) {
        const prefix = parameter.substr(0, 2);
        let reference = contexts.finalMessage;
        if (this.isContextRef(prefix)) {
            reference = this.getReference(prefix, contexts);
            parameter = parameter.substr(2);
        }
        StaticAccessor.setOrDeleteValue(reference, null, parameter.split("."), 0);
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
        const arrayResult = StaticAccessor.analizeArraySyntaxToSet(reference, elementsToCreate[elementsPosition]);
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
                StaticAccessor.setOrDeleteValue(arrayResult[0][arrayResult[1]], valueToCreate, elementsToCreate, elementsPosition + 1);
            }
            else {
                StaticAccessor.setOrDeleteValue(arrayResult[0], valueToCreate, elementsToCreate, elementsPosition + 1);
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
exports.StaticAccessor = StaticAccessor;
