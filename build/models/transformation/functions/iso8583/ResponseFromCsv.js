"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFromCsv = void 0;
const string_1 = __importDefault(require("string"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const ResponseFromCsvITF_1 = require("./ResponseFromCsvITF");
const ResponseFromCsvITF_validator_1 = __importDefault(require("./ResponseFromCsvITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const fsReadFile = util_1.default.promisify(fs_1.default.readFile);
const fsExists = util_1.default.promisify(fs_1.default.exists);
class ResponseFromCsv extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { finalMessage } = contexts;
            const { filePath } = this.props;
            let { file } = this.props;
            let ignoringMessage = false;
            if (!file && filePath) {
                const isPresent = yield fsExists(filePath);
                if (isPresent) {
                    const readFile = yield fsReadFile(filePath);
                    file = string_1.default(readFile);
                }
            }
            if (!file)
                throw new Error("The file was not loaded");
            if (!Object.keys(finalMessage).length) {
                this.logger.error("[ ReadCSV ] - The readCSV procces will not be started because the finalMessage is empty", { logPrefix });
                return { ignoringMessage };
            }
            if (finalMessage["000"] == "0400" ||
                finalMessage["000"] == "0220" ||
                finalMessage["000"] == "0500" ||
                finalMessage["000"] == "0320" ||
                finalMessage["000"] == "0800") {
                finalMessage["039"] = "00";
                this.logger.debug("[ ReadCSV ] - El mensaje recibido es una  reversa, offline, echotest, batch upload o cierre. Respondemos siempre OK", {
                    logPrefix,
                });
            }
            else {
                let ready = false, rowNum = 0;
                file.lines().forEach(line => {
                    let regexPassed = true;
                    const actualRow = string_1.default(line).parseCSV(",");
                    if (rowNum != 0 && actualRow.length > 1 && ready == false) {
                        this.logger.trace(`[ ReadCSV ] - Appliying row N° ${rowNum}:${actualRow}`, { logPrefix });
                        if (finalMessage["002"] == actualRow[0] || (finalMessage["035"] != undefined && finalMessage["035"].split("=")[0] == actualRow[0])) {
                            this.logger.debug("[ ReadCSV ] - This row was applied. We found the card", { logPrefix });
                            if (actualRow[4] != "" && parseFloat(finalMessage["004"]) / 100.0 > parseFloat(actualRow[4])) {
                                regexPassed = false;
                                this.logger.debug("[ ReadCSV ] - The amout is SO big. Conitnuing with the next row", { logPrefix });
                            }
                            if (actualRow[3] != "" && parseFloat(finalMessage["004"]) / 100.0 < parseFloat(actualRow[3])) {
                                regexPassed = false;
                                this.logger.debug("[ ReadCSV ] - The amout is not big enough. Conitnuing with the next row", { logPrefix });
                            }
                        }
                        else {
                            regexPassed = false;
                            this.logger.debug("[ ReadCSV ] - The card number is not equal to the indicated. Conitnuing with the next actualRow", { logPrefix });
                        }
                        if (regexPassed) {
                            this.logger.debug("[ ReadCSV ] - The card and the amount were verified. Appliying transformation", { logPrefix });
                            ready = true;
                            if (actualRow[5] == "SIN RESPUESTA") {
                                ignoringMessage = true;
                                this.logger.debug("[ ReadCSV ] - Response Code: SIN RESPUESTA", { logPrefix });
                            }
                            else {
                                finalMessage["039"] = actualRow[5];
                                // Si el codigo de respuesta es APROBADA, enviamos un codigo de autorizacion
                                if (actualRow[5] == "00" || actualRow[5] == "11" || actualRow[5] == "85") {
                                    finalMessage["038"] = finalMessage["011"];
                                }
                                // Enviamos un numero de cuenta en la respuesta
                                finalMessage["037"] = finalMessage["011"] + finalMessage["011"];
                                if (finalMessage["048"] != null && finalMessage["048"] != undefined && finalMessage["048"].substr(2, 1) == "7") {
                                    this.logger.trace("[ ReadCSV ] - Adding AHORA 12 label in field 63", { logPrefix });
                                    finalMessage["063"] = "AHORA 12 . PLAN DE INCENTIVO AL CONSUMO";
                                }
                                if (finalMessage["048"] != null &&
                                    finalMessage["048"] != undefined &&
                                    finalMessage["048"].substr(0, 1) == "1" &&
                                    actualRow[0].substr(0, 1) == "4") {
                                    if (finalMessage["000"] == "0200" && finalMessage["003"] == "000000") {
                                        this.logger.trace("[ ReadCSV ] - Adding Plan V buy label in field 63");
                                        finalMessage["063"] = "PV200000108130488200401                              000000002439";
                                    }
                                    else if (finalMessage["000"] == "0100" && finalMessage["003"] == "300006") {
                                        this.logger.trace("[ ReadCSV ] - Adding Plan V query label in field 63", { logPrefix });
                                        finalMessage["063"] =
                                            "PV10200000360070488203000002447404882040000018711048820500000152580488206000001295804882                              ";
                                    }
                                }
                                if (finalMessage["059"] != undefined && finalMessage["059"] != null) {
                                    const date = new Date().getTime().toString();
                                    finalMessage["034"] = date;
                                }
                            }
                        }
                    }
                    rowNum++;
                });
            }
            return { ignoringMessage };
        });
    }
}
exports.ResponseFromCsv = ResponseFromCsv;
ResponseFromCsv.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ResponseFromCsvITF_1.fieldsNameMappigns, ResponseFromCsvITF_validator_1.default);
    if (!params.filePath || !fs_1.default.existsSync(params.filePath))
        throw new Error("The csv file was not found");
    else {
        params.file = string_1.default(fs_1.default.readFileSync(params.filePath));
    }
    return new ResponseFromCsv(params);
};
