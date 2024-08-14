"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strings = void 0;
class Strings {
    static paddField(field, charToUse, length, position) {
        let fieldString = field.toString();
        const lengthToPadd = length - fieldString.length;
        let aux = "";
        for (let i = 0; i < lengthToPadd; i++)
            aux += charToUse;
        if (position == "L" || position == "I") {
            fieldString = aux + fieldString;
            return fieldString.substr(length - fieldString.length);
        }
        else {
            fieldString = fieldString + aux;
            return fieldString.substr(0, length);
        }
    }
}
exports.Strings = Strings;
