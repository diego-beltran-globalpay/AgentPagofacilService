"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Numbers = exports.DivResultType = void 0;
var DivResultType;
(function (DivResultType) {
    DivResultType["Float"] = "Float";
    DivResultType["Integer"] = "Integer";
})(DivResultType = exports.DivResultType || (exports.DivResultType = {}));
class Numbers {
    static convertFixedToFloat(pInput, decimalLength) {
        if (pInput == undefined || pInput == null)
            return undefined;
        pInput = String(pInput);
        let aux = pInput.substr(0, pInput.length - decimalLength) + "." + pInput.substr(pInput.length - decimalLength);
        aux = parseFloat(aux).toFixed(decimalLength);
        return aux.toString();
    }
    static convertFloatToFixed(pInput, totalLength, decimalLength) {
        if (pInput == undefined || pInput == null)
            return undefined;
        // Calculamos la cantidad de digitos para la parte entera
        const integerLength = totalLength - decimalLength;
        let decimalZeros = "", integerZeros = "";
        // Generamos la cantidad de ceros maxima para los decimales
        for (let i = 0; i < decimalLength; i++)
            decimalZeros += "0";
        // Generamos la cantidad de ceros maxima para la parte entera
        for (let i = 0; i < integerLength; i++)
            integerZeros += "0";
        const roundedInput = Numbers.roundNumber(pInput, decimalLength);
        const Input = String(roundedInput);
        let Output = Input.indexOf(".") == -1
            ? Input + decimalZeros
            : Input.substr(Input.indexOf(".") + 1).length >= decimalLength
                ? Input.substr(0, Input.indexOf(".")) + Input.substr(Input.indexOf(".") + 1).substr(0, decimalLength)
                : Input.substr(0, Input.indexOf(".")) + (Input.substr(Input.indexOf(".") + 1) + decimalZeros).substr(0, decimalLength);
        Output =
            integerZeros.substring(Output.substr(0, Output.length - decimalLength).length) +
                Output.substr(0, Output.length - decimalLength) +
                Output.substr(Output.length - decimalLength);
        return Output;
    }
    static roundNumber(num, scale) {
        if (("" + num).indexOf("e") < 0) {
            return +(Math.round(Number(num + "e+" + scale)) + "e-" + scale);
        }
        else {
            const arr = ("" + num).split("e");
            let sig = "";
            if (+arr[1] + scale > 0)
                sig = "+";
            return +(Math.round(Number(+arr[0] + "e" + sig + (+arr[1] + scale))) + "e-" + scale);
        }
    }
    static truncateNumber(num, scale) {
        const stringNum = num.toString();
        const result = stringNum.split(".");
        if (result[0].length <= scale)
            return parseFloat(stringNum);
        return parseFloat(result[0] + "." + result[1].substr(0, scale));
    }
    static division(num1, num2, resultType = DivResultType.Float) {
        if (isNaN(num1) || isNaN(num2))
            return undefined;
        const result = num1 / num2;
        if (resultType === DivResultType.Float)
            return result.toFixed(2);
        else
            return result.toFixed(0);
    }
}
exports.Numbers = Numbers;
