"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericMsgKey = void 0;
class GenericMsgKey {
    constructor(fieldsName) {
        this.fieldsNameList = fieldsName.map(fieldName => fieldName.split("."));
    }
    getValueFromObject(message, fieldNameParts) {
        let fieldValueRef;
        if (fieldNameParts[0] === "*")
            fieldValueRef = message[Object.keys(message)[0]];
        else
            fieldValueRef = message[fieldNameParts[0]];
        if (fieldValueRef === undefined)
            return undefined;
        for (let j = 1; j < fieldNameParts.length; j++) {
            if (fieldNameParts[j] === "*")
                fieldValueRef = fieldValueRef[Object.keys(fieldValueRef)[0]];
            else
                fieldValueRef = fieldValueRef[fieldNameParts[j]];
            if (fieldValueRef === undefined)
                return undefined;
        }
        return fieldValueRef;
    }
}
exports.GenericMsgKey = GenericMsgKey;
