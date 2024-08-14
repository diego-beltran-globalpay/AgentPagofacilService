"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictc = void 0;
const FormatterModel_1 = require("./FormatterModel");
class Dictc extends FormatterModel_1.FormatterModel {
    encode(message) {
        const { body, messageID } = message;
        //logger.trace( `Encode - message is an array`, { messageID } );
        const messageKeys = Object.keys(body).length;
        //logger.trace( `Encode - message length: ${messageKeys}`, { messageID } );
        let returnValue = this.encodeNumber(messageKeys);
        //logger.trace( `Encode - encoded messageKeys: ${returnValue}`, { messageID } );
        //var i = 0;
        let aux;
        for (const keyName in body) {
            //logger.trace( `Encode - message KeyName[${i}]=[${keyName}]`, { messageID } );
            const keyValue = body[keyName];
            // logger.trace( `Encode - message KeyValue[${i}]=[${keyValue}]`, { messageID } );
            if (keyValue && keyValue != ``) {
                if (!isNaN(parseInt(keyName))) {
                    //logger.trace( `Encode - message KeyName[${i}] is a number`, { messageID } );
                    const keyNameString = `000`.substr(keyName.toString().length) + keyName.toString();
                    //logger.trace( `Encode - message keyName in String: ${keyNameString}`, { messageID } );
                    aux = this.encodeNumber(keyNameString.length);
                    //logger.trace( `Encode - encoded keyName: ${aux}`, { messageID } );
                    returnValue = returnValue + aux + keyNameString;
                }
                else {
                    //logger.trace( `Encode - message KeyName[${i}] is an string`, { messageID } );
                    aux = this.encodeNumber(keyName.length);
                    //logger.trace( `Encode - encoded keyName: ${aux}`, { messageID } );
                    returnValue = returnValue + aux + keyName;
                }
                if (keyValue instanceof Array) {
                    //logger.trace( `Encode - keyValue is an array`, { messageID } );
                    //var j = 0;
                    for (const propertyName in keyValue) {
                        //logger.trace( `Encode - keyValue propertyName N${j}: ${propertyName}`, { messageID } );
                        const propertyValue = keyValue[propertyName];
                        //logger.trace( `Encode - keyValue propertyValue N${j}: ${propertyValue}`, { messageID } );
                        if (propertyValue instanceof Array) {
                            //logger.trace( `Encode - propertyValue N${j} is an array`, { messageID } );
                        }
                        else {
                            //logger.trace( `Encode - propertyValue N${j} is not array`, { messageID } );
                            returnValue =
                                returnValue +
                                    this.encodeNumber(keyName.length) +
                                    keyName +
                                    `P` +
                                    this.encodeNumber(propertyName.length) +
                                    propertyName +
                                    this.encodeNumber(propertyValue.length) +
                                    propertyValue;
                        }
                        //j++;
                    }
                }
                else {
                    //logger.trace( `Encode - keyValue is not an array`, { messageID } );
                    returnValue = returnValue + "P" + this.encodeNumber(0) + this.encodeNumber(keyValue.length) + keyValue;
                }
            }
            //i++;
        }
        return Buffer.from(returnValue, "utf8");
    }
    bufferDecode(input, encoding) {
        const message = input.toString(encoding), returnValue = {};
        let pointer = 0;
        const endoceSize = 3;
        //logger.trace( `Decode - Typeof message: ${typeof message}`, { messageID } );
        if (typeof message == "string" && message.length > 0) {
            //logger.trace( `Decode - message is a string, and its length is bigger than 0`, { messageID } );
            const messageKeys = this.decodeNumber(message);
            //logger.trace( `Decode - messageKeys Decoded: ${messageKeys}`, { messageID } );
            pointer += endoceSize;
            for (let counterFields = 0; counterFields < messageKeys; counterFields++) {
                //logger.trace( `Decode - counterField: ${counterFields}`, { messageID } );
                const keyNameLength = this.decodeNumber(message.substring(pointer, pointer + endoceSize));
                //logger.trace( `Decode - keyNameLength: ${keyNameLength}`, { messageID } );
                pointer += endoceSize;
                const keyName = message.substring(pointer, pointer + keyNameLength);
                pointer += keyNameLength;
                //logger.trace( `Decode - keyName: ${keyName}`, { messageID } );
                if (message.substring(pointer, pointer + 1) == `P`) {
                    pointer += 1;
                    const propertyLength = this.decodeNumber(message.substring(pointer, pointer + endoceSize));
                    pointer += endoceSize;
                    if (propertyLength > 0) {
                        //var propertyName    = message.substring( pointer, pointer + propertyLength );
                        pointer += propertyLength;
                    }
                    const valueLength = this.decodeNumber(message.substring(pointer, pointer + endoceSize));
                    pointer += endoceSize;
                    let keyValue = null;
                    if (valueLength > 0) {
                        keyValue = message.substring(pointer, pointer + valueLength);
                        pointer += valueLength;
                        //logger.trace( `Decode - keyValue: ${keyValue}`, { messageID } );
                    }
                    //logger.trace( `Decode - propertyLength: ${propertyLength}`, { messageID } );
                    if (propertyLength > 0) {
                        //logger.trace( `Decode - 1returnValue[${keyName}]=[${keyValue}]`, { messageID } );
                        // No queremos en nusetra conversion, elementos en el array que contengan otro array
                        //returnValue[ keyName ][ propertyName ] = keyValue;
                    }
                    else {
                        // COMENTAMOS ESTA LINEA PORQUE PRETENDEMOS TRABAJAR CON ARRAYS ASOCIATIVOS, POR LO QUE YA NO TENDREMOS QUE CONVERTIR A INT LA POSICION EN EL ARRAY
                        //var keyNameInt = parseInt( keyName );
                        //logger.trace( `Decode - 2returnValue[${keyName}]=[${keyValue}]`, { messageID } );
                        //logger.trace( `Decode - keyNameInt: ${keyNameInt}`, { messageID } );
                        // No queremos en nusetra conversion, elementos en el array que tengan un String como clave
                        // COMENTAMOS ESTA LINEA PORQUE PRETENDEMOS TRABAJAR CON ARRAYS ASOCIATIVOS, POR LO QUE YA NO TENDREMOS QUE CONVERTIR A INT LA POSICION EN EL ARRAY
                        //if( !isNaN( keyNameInt ) ){
                        returnValue[keyName] = keyValue;
                        //}
                    }
                }
                else if (message.substring(pointer, pointer + 1) == `A`) {
                    // TODO Implementar
                }
            }
        }
        //logger.trace( `Decode - returnValue to return: ${JSON.stringify(returnValue)}`, { messageID });
        return returnValue;
    }
    decodeNumber(pMessage) {
        const aux1 = pMessage.substring(0, 1);
        const aux2 = pMessage.substring(1, 2);
        const aux3 = pMessage.substring(2, 3);
        return (aux1.charCodeAt(0) & 0x1f) | ((aux2.charCodeAt(0) & 0x3f) << 5) | ((aux3.charCodeAt(0) & 0x1f) << 11);
    }
    encodeNumber(nValue) {
        let sValue;
        const aux1 = (nValue & 0x001f) | 0x40;
        const aux2 = ((nValue & 0x07e0) >> 5) | 0x40;
        const aux3 = ((nValue & 0xf800) >> 11) | 0x40;
        sValue = String.fromCharCode(aux1);
        sValue += String.fromCharCode(aux2);
        sValue += String.fromCharCode(aux3);
        return sValue;
    }
}
exports.Dictc = Dictc;
