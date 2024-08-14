"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedFields = void 0;
const ValueParser_1 = require("./ValueParser");
class NamedFields {
    static getParams(paramsStr, fieldsMap, validate) {
        const isNamed = NamedFields.isTypeOf(paramsStr);
        const splitedParams = paramsStr !== "" ? paramsStr.split(",") : [];
        const params = {};
        splitedParams.forEach((param, index) => {
            let varType, varName, value, alias;
            if (isNamed) {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;
                [alias, value] = param.split("=");
                if (!Object.keys(fieldsMap).includes(alias))
                    throw new Error(`The field name ${alias} is not included`);
                varName = fieldsMap[alias]["name"];
                varType = fieldsMap[alias]["type"];
                params[varName] = ValueParser_1.ValueParser.parseValue(varType, value);
            }
            else {
                const fields = Object.values(fieldsMap).filter(({ position }) => position === index);
                if (!fields.length)
                    throw new Error(`The param in position ${index} is not necessary. Remove it!`);
                value = param;
                fields.forEach(field => {
                    // eslint-disable-next-line @typescript-eslint/no-extra-semi
                    ;
                    ({ name: varName, type: varType } = field);
                    params[varName] = ValueParser_1.ValueParser.parseValue(varType, value);
                });
            }
        });
        return validate(params);
    }
}
exports.NamedFields = NamedFields;
NamedFields.namedFieldsRegex = new RegExp(/((\w+=[\w|\.|%|!|/]+),?)+/);
NamedFields.isTypeOf = (params) => {
    return NamedFields.namedFieldsRegex.test(params);
};
