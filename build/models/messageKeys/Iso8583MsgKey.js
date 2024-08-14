"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iso8583MsgKey = void 0;
const GenericMsgKey_1 = require("./GenericMsgKey");
class Iso8583MsgKey extends GenericMsgKey_1.GenericMsgKey {
    get(message) {
        let generatedKey = "", firstField = true;
        this.fieldsNameList.forEach(fieldNameParts => {
            let fieldValueRef = this.getValueFromObject(message, fieldNameParts);
            if (fieldValueRef === undefined)
                return undefined;
            if (firstField) {
                fieldValueRef = this.getIsoResponseField(fieldValueRef);
                firstField = false;
            }
            generatedKey += (isNaN(fieldValueRef) ? fieldValueRef.trim() : parseInt(fieldValueRef)) + "_";
        });
        return generatedKey.substr(0, generatedKey.length - 1);
    }
    getIsoResponseField(field) {
        return field.substr(0, 1) + field.substr(1, 1) + (parseInt(field.substr(2, 1)) + 1).toString() + field.substr(3, 1);
    }
}
exports.Iso8583MsgKey = Iso8583MsgKey;
