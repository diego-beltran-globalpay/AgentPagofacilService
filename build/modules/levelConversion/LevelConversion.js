"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelConversion = exports.ConvDirections = void 0;
const LoggersColletion_1 = require("../logger/LoggersColletion");
var ConvDirections;
(function (ConvDirections) {
    ConvDirections["clientBfTransf"] = "ClientBfTransf";
    ConvDirections["clientAfTransf"] = "ClientAfTransf";
    ConvDirections["targetBfTransf"] = "TargetBfTransf";
    ConvDirections["targetAfTransf"] = "TargetAfTransf";
})(ConvDirections = exports.ConvDirections || (exports.ConvDirections = {}));
class LevelConversion {
    constructor(convDirecConfig) {
        this.convDirecConfig = convDirecConfig;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
    }
    static innerConvertToSingleLevel(initialMessage) {
        const finalMessage = {};
        analizeElement2(undefined, initialMessage, finalMessage, "");
        return finalMessage;
    }
    static innerConvertToMultiLevel(initialMessage) {
        const finalMessage = {};
        for (const fieldName in initialMessage)
            analizeElement(finalMessage, fieldName, initialMessage[fieldName], undefined, 0);
        return finalMessage;
    }
    convertLevel(message, step) {
        const type = this.convDirecConfig[step];
        switch (type) {
            case "multi":
                return this.convertToMultiLevel(message);
            case "single":
                return this.convertToSingleLevel(message);
            default:
                return message.body;
        }
    }
    convertToSingleLevel(message) {
        const logger = LoggersColletion_1.LoggerInstance.getInstance();
        const { body: initialMessage, messageID } = message;
        const finalMessage = {};
        logger.debug("[ LevelConversion ] - Starting to convert the request to a single level message", { messageID });
        // Solo logearemos el mensaje entrante en el nivel de TRACE
        if (logger.level == "TRACE") {
            logger.trace("[ LevelConversion ] - Initial Message: ", { messageID });
            logger.trace(`[ LevelConversion ] - ${JSON.stringify(initialMessage, null, 2)}`, { messageID });
        }
        analizeElement2(undefined, initialMessage, finalMessage, "");
        // Solo logearemos el mensaje entrante en el nivel de TRACE
        if (logger.level == "TRACE") {
            logger.trace("[ LevelConversion ] - Final Message: ", { messageID });
            logger.trace(`[ LevelConversion ] - ${JSON.stringify(finalMessage, null, 2)}`, { messageID });
        }
        return finalMessage;
    }
    convertToMultiLevel(message) {
        const logger = LoggersColletion_1.LoggerInstance.getInstance();
        const { body: initialMessage, messageID } = message;
        const finalMessage = {};
        logger.debug("[ LevelConversion ] - Starting to convert the request to a multi level message", { messageID });
        // Solo logearemos el mensaje entrante en el nivel de TRACE
        if (logger.level == "TRACE") {
            logger.trace("[ LevelConversion ] - Initial Message: ", { messageID });
            logger.trace(`[ LevelConversion ] - ${JSON.stringify(initialMessage, null, 2)}`, { messageID });
        }
        for (const fieldName in initialMessage)
            analizeElement(finalMessage, fieldName, initialMessage[fieldName], undefined, 0);
        // Solo logearemos el mensaje entrante en el nivel de TRACE
        if (logger.level == "TRACE") {
            logger.trace("[ LevelConversion ] - Final Message: ", { messageID });
            logger.trace(`[ LevelConversion ] - ${JSON.stringify(finalMessage, null, 2)}`, { messageID });
        }
        return finalMessage;
    }
}
exports.LevelConversion = LevelConversion;
function analizeElement(message, element, value, arrayPosition, actualPos) {
    const nextStep = element.indexOf(".", actualPos);
    //console.log( "NextStep= " + nextStep );
    if (nextStep === -1) {
        const actualElement = element.substring(actualPos);
        if (!new RegExp(/^(.+\[[0-9]+\])$/).test(actualElement)) {
            if (arrayPosition !== undefined) {
                if (message[arrayPosition] === undefined) {
                    //console.log( "Creating element inside the array position [" + arrayPosition + "]" );
                    message[arrayPosition] = {};
                }
                //console.log( "Setting value [" + value + "] to the element [" + actualElement + "] inside the array in the position [" + arrayPosition + "]" );
                message[arrayPosition][actualElement] = value;
            }
            else {
                if (message[actualElement] === undefined) {
                    //console.log( "Creating element " + actualElement );
                    message[actualElement] = {};
                }
                //console.log( "Setting value [" + value + "] to the element [" + actualElement + "]" );
                message[actualElement] = value;
            }
        }
        else {
            const finalActualElement = actualElement.substring(0, actualElement.indexOf("["));
            const actualArrayPosition = actualElement.substring(actualElement.indexOf("[") + 1, actualElement.indexOf("]"));
            if (arrayPosition !== undefined) {
                if (message[arrayPosition] === undefined) {
                    //console.log( "Creating element inside the array position [" + arrayPosition + "]");
                    message[arrayPosition] = {};
                }
                //console.log( "Setting value [" + value + "] to the element [" + actualElement + "]");
                message[arrayPosition][actualElement] = value;
            }
            else {
                if (message[finalActualElement] === undefined) {
                    //console.log( "Creating array " + finalActualElement );
                    message[finalActualElement] = [];
                }
                //console.log( "Setting value [" + value + "] to the array [" + finalActualElement + "] in position [" + actualArrayPosition + "]");
                message[finalActualElement][actualArrayPosition] = value;
            }
        }
    }
    else {
        const actualElement = element.substring(actualPos, nextStep);
        if (!new RegExp(/^(.+\[[0-9]+\])$/).test(actualElement)) {
            if (arrayPosition !== undefined) {
                if (message[arrayPosition][actualElement] === undefined) {
                    //console.log( "Creating element [" + actualElement + "] inside the position [" + arrayPosition + "] of the array" );
                    message[arrayPosition][actualElement] = {};
                }
                analizeElement(message[arrayPosition][actualElement], element, value, undefined, nextStep + 1);
            }
            else {
                if (message[actualElement] === undefined) {
                    //console.log( "Creating element " + actualElement );
                    message[actualElement] = {};
                }
                analizeElement(message[actualElement], element, value, undefined, nextStep + 1);
            }
        }
        else {
            const finalActualElement = actualElement.substring(0, actualElement.indexOf("["));
            const actualArrayPosition = actualElement.substring(actualElement.indexOf("[") + 1, actualElement.indexOf("]"));
            if (arrayPosition !== undefined) {
                if (message[arrayPosition][finalActualElement] === undefined) {
                    //console.log( "Creating array [" + finalActualElement + "] inside the position [" + arrayPosition + "] of the array" );
                    message[arrayPosition][finalActualElement] = [];
                }
                analizeElement(message[finalActualElement], element, value, actualArrayPosition, nextStep + 1);
            }
            else {
                if (message[finalActualElement] === undefined) {
                    //console.log( "Creating array " + finalActualElement );
                    message[finalActualElement] = [];
                }
                analizeElement(message[finalActualElement], element, value, actualArrayPosition, nextStep + 1);
            }
        }
    }
}
function analizeElement2(elementName, elementValue, finalMessage, partialResult) {
    if (typeof elementValue == "string" || typeof elementValue == "number" || typeof elementValue == "boolean") {
        //console.log( "Found an string " );
        finalMessage[partialResult] = elementValue;
    }
    else if (elementValue instanceof Array) {
        //console.log( "Found an array " );
        for (const elementNum in elementValue)
            analizeElement2(elementName, elementValue[elementNum], finalMessage, partialResult + "[" + elementNum + "]");
    }
    else if (elementValue instanceof Object) {
        //console.log( "Found an object" );
        for (const subElementName in elementValue)
            analizeElement2(subElementName, elementValue[subElementName], finalMessage, elementName !== undefined ? partialResult + "." + subElementName : subElementName);
    }
    else {
        //console.log( "Unknown type" );
    }
}
