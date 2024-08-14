"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanedMsgKey = void 0;
const GenericMsgKey_1 = require("./GenericMsgKey");
class CleanedMsgKey extends GenericMsgKey_1.GenericMsgKey {
    get(message) {
        let generatedKey = "";
        this.fieldsNameList.forEach(fieldNameParts => {
            const fieldValueRef = this.getValueFromObject(message, fieldNameParts);
            if (fieldValueRef === undefined)
                return undefined;
            generatedKey += (isNaN(fieldValueRef) ? fieldValueRef.trim() : parseInt(fieldValueRef)) + "_";
        });
        return generatedKey.substr(0, generatedKey.length - 1);
    }
}
exports.CleanedMsgKey = CleanedMsgKey;
