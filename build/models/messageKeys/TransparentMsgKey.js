"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransparentMsgKey = void 0;
const GenericMsgKey_1 = require("./GenericMsgKey");
class TransparentMsgKey extends GenericMsgKey_1.GenericMsgKey {
    get(message) {
        let generatedKey = "";
        this.fieldsNameList.forEach(fieldNameParts => {
            const fieldValueRef = this.getValueFromObject(message, fieldNameParts);
            if (fieldValueRef === undefined)
                return;
            generatedKey += fieldValueRef + "_";
        });
        return generatedKey.substr(0, generatedKey.length - 1);
    }
}
exports.TransparentMsgKey = TransparentMsgKey;
