"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementMapping = exports.MapDirections = void 0;
const fs_1 = __importDefault(require("fs"));
const LoggersColletion_1 = require("../logger/LoggersColletion");
const ElementMappingFileType_validator_1 = __importDefault(require("./ElementMappingFileType.validator"));
var MapDirections;
(function (MapDirections) {
    MapDirections["clientBfTransf"] = "ClientBfTransf";
    MapDirections["clientAfTransf"] = "ClientAfTransf";
    MapDirections["targetBfTransf"] = "TargetBfTransf";
    MapDirections["targetAfTransf"] = "TargetAfTransf";
})(MapDirections = exports.MapDirections || (exports.MapDirections = {}));
class ElementMapping {
    constructor(sourceFilePathList, loadElementMapRulesOnce, mapDirecConfig) {
        this.sourceFilePathList = sourceFilePathList;
        this.loadElementMapRulesOnce = loadElementMapRulesOnce;
        this.mapDirecConfig = mapDirecConfig;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.elementMap = this.loadElementsMappingFiles();
    }
    mapElements(message, step) {
        const { body: initialMessage, messageID } = message;
        this.logger.debug("[ElementMapping] - Starting elements mapping process", { messageID });
        // Recargaremos el archivo de transformacion por cada mensaje a transformar, si es que asi se indico por configuracion
        if (!this.loadElementMapRulesOnce) {
            this.logger.debug("[ElementMapping] - Reloading file", { messageID });
            this.elementMap = this.loadElementsMappingFiles();
        }
        // Si no se logro cargar ningun archivo, o no tenemos ninguna regla de transformacion en los archivos cargados, no haremos ninguna transformacion
        if (!Object.keys(this.elementMap.ElementsMapping).length) {
            this.logger.warn("[ElementMapping] - Mapping rules is empty", { messageID });
            return message;
        }
        // Solo logearemos el mensaje entrante en el nivel de TRACE
        if (this.logger.level === "TRACE") {
            this.logger.trace("[ElementMapping] - Initial Message: ", { messageID });
            this.logger.trace(`[ LevelConversion ] - ${JSON.stringify(initialMessage, null, 2)}`, { messageID });
        }
        // Copiamos todos los campos del mensaje inicial al mensaje final, para luego aplicar el mapeo al mensaje final, eliminando el valor previo mapeado, y dejando sin cambiar todo campo que no tenga un mapeo.
        const finalMessage = Object.assign({}, initialMessage);
        const [actualDirection, actualSense] = this.mapDirecConfig[step].split(",");
        this.logger.trace(`[ElementMapping] - Direction: [${actualDirection}] - Sense: [${actualSense}]`, { messageID });
        const mapGroup = this.elementMap[actualDirection];
        if (mapGroup) {
            mapGroup.forEach(({ Key, Value }) => {
                let sourceElementNameElements;
                let targetElementNameElements;
                if (actualSense === "L2R") {
                    sourceElementNameElements = Key;
                    targetElementNameElements = Value;
                }
                else if (actualSense === "R2L") {
                    sourceElementNameElements = Value;
                    targetElementNameElements = Key;
                }
                else {
                    this.logger.error("[ElementMapping] - Sense of element mapping is not valid. We will not apply this element mapping.", { messageID });
                    return;
                }
                this.checkTypeValue(initialMessage, finalMessage, sourceElementNameElements, targetElementNameElements, 0, 0);
            });
        }
        // Solo logearemos el mensaje entrante en el nivel de TRACE
        if (this.logger.level === "TRACE") {
            this.logger.trace("[ElementMapping] - Final Message: ", { messageID });
            this.logger.trace(`[ LevelConversion ] - ${JSON.stringify(finalMessage, null, 2)}`, { messageID });
        }
        return finalMessage;
    }
    loadElementsMappingFiles() {
        this.logger.debug("[ElementMapping][ loadElementsMappingFiles ] - Loading transformation files and putting them into only one file");
        const mixedFiles = this.sourceFilePathList.reduce((elementMapJSON, sourceFilePath) => {
            if (!fs_1.default.existsSync(sourceFilePath)) {
                this.logger.trace(`[ElementMapping][ loadElementsMappingFiles ] - The file with path ${sourceFilePath} was not found`);
                return elementMapJSON;
            }
            try {
                this.logger.trace(`[ElementMapping][ loadElementsMappingFiles ] - The file ${sourceFilePath} was found`);
                const file = fs_1.default.readFileSync(sourceFilePath, "utf-8");
                this.logger.trace(`[ElementMapping][ loadElementsMappingFiles ] - The file ${sourceFilePath} was read`);
                const fileJson = ElementMappingFileType_validator_1.default(JSON.parse(file));
                this.logger.trace(`[ElementMapping][ loadElementsMappingFiles ] - The file ${sourceFilePath} was converted to JSON object`);
                elementMapJSON.ElementsMapping = Object.assign(elementMapJSON.ElementsMapping, fileJson.ElementsMapping);
                this.logger.trace(`[ElementMapping][ loadElementsMappingFiles ] - The file ${sourceFilePath} was concated`);
            }
            catch (error) {
                this.logger.error(`[ElementMapping][ loadElementsMappingFiles ] - The file ${sourceFilePath} could not be load.`);
                this.logger.error(error);
            }
            return elementMapJSON;
        }, { ElementsMapping: {} });
        const mapRules = {};
        for (const mapGroupName in mixedFiles.ElementsMapping) {
            const parsedMapGroup = [];
            const mapGroup = mixedFiles.ElementsMapping[mapGroupName];
            for (const mapRule in mapGroup) {
                parsedMapGroup.push({ Key: mapRule.split("."), Value: mapGroup[mapRule].split(".") });
            }
            mapRules[mapGroupName] = parsedMapGroup;
        }
        return mapRules;
    }
    checkTypeValue(initialMsgReference, finalMsgReference, sourceElementNameElements, targetElementNameElements, elementMapPosition, wildElementPosition) {
        let isWildcardActive = false;
        if (elementMapPosition === sourceElementNameElements.length)
            return true;
        let sourceElementName = sourceElementNameElements[elementMapPosition];
        let targetElementName = targetElementNameElements[elementMapPosition];
        if (sourceElementName === "*") {
            sourceElementName = Object.keys(initialMsgReference)[wildElementPosition];
            targetElementName = sourceElementName;
            wildElementPosition = wildElementPosition + 1;
            isWildcardActive = true;
        }
        switch (typeof initialMsgReference[sourceElementName]) {
            case "undefined":
                return false;
            case "number":
            case "string":
                if (isWildcardActive)
                    return true;
                finalMsgReference[targetElementName] = initialMsgReference[sourceElementName];
                if (finalMsgReference[sourceElementName] !== undefined)
                    delete finalMsgReference[sourceElementName];
                this.checkTypeValue(initialMsgReference, finalMsgReference, sourceElementNameElements, targetElementNameElements, elementMapPosition + 1, 0);
                break;
            case "object":
                if (initialMsgReference[sourceElementName] instanceof Array) {
                    if (finalMsgReference[targetElementName] === undefined) {
                        finalMsgReference[targetElementName] = initialMsgReference[sourceElementName].slice();
                        delete finalMsgReference[sourceElementName];
                    }
                    for (let arrayPosition = 0; arrayPosition < finalMsgReference[targetElementName].length; arrayPosition++)
                        this.checkTypeValue(initialMsgReference[sourceElementName][arrayPosition], finalMsgReference[targetElementName][arrayPosition], sourceElementNameElements, targetElementNameElements, elementMapPosition + 1, 0);
                }
                else if (initialMsgReference[sourceElementName] instanceof Object) {
                    if (finalMsgReference[targetElementName] === undefined) {
                        finalMsgReference[targetElementName] = {};
                        Object.assign(finalMsgReference[targetElementName], initialMsgReference[sourceElementName]);
                        delete finalMsgReference[sourceElementName];
                    }
                    this.checkTypeValue(initialMsgReference[sourceElementName], finalMsgReference[targetElementName], sourceElementNameElements, targetElementNameElements, elementMapPosition + 1, 0);
                }
                else {
                    this.logger.error(`[ElementMapping] - ElementName: [${sourceElementName}] - Unknow instanceof value.`);
                }
                break;
        }
        if (isWildcardActive === true && Object.keys(initialMsgReference).length !== wildElementPosition)
            this.checkTypeValue(initialMsgReference, finalMsgReference, sourceElementNameElements, targetElementNameElements, elementMapPosition, wildElementPosition);
    }
}
exports.ElementMapping = ElementMapping;
