"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformation = void 0;
const uuid = __importStar(require("uuid"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
const TransformationGroup_1 = require("./components/TransformationGroup");
const Actions_1 = require("../messages/Actions");
const TransformationOpts_1 = require("./TransformationOpts");
const ClassLoader_1 = require("../extension/ClassLoader");
const ExtensionableClass_1 = require("./extensionClass/ExtensionableClass");
const File_1 = require("../fileLoader/File");
const codecs_1 = require("../protocol/codecs");
const GlobalFilesCollection_1 = require("./tables/GlobalFilesCollection");
const TransformationRule_1 = require("./components/TransformationRule");
class Transformation {
    constructor(opts) {
        this.opts = opts;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.groups = {};
        this.hashes = {};
        this.getLogPrefix = () => {
            return this.logPrefix;
        };
        this.existsGroupRule = (groupName) => !!this.groups[groupName];
        this.reloadAll = (logPrefix) => {
            try {
                // Reload all table files
                if (GlobalFilesCollection_1.GlobalTablesCollection.isInited())
                    GlobalFilesCollection_1.GlobalTablesCollection.get().reloadAll(logPrefix);
                // Reload all transformation files
                const jsonGroups = this.loadGroupRulesFiles(logPrefix);
                if (jsonGroups)
                    this.parseGroupRulesFiles(jsonGroups, logPrefix);
            }
            catch (error) {
                this.logger.error(`Some error happened trying to load rules and/or tables files. ${error}. Stack: ${error.stack}`, {
                    logPrefix: logPrefix,
                });
            }
        };
        const { transformFilePathList, encryptionModule, logPrefix: newLogPrefix } = this.opts;
        this.logPrefix = newLogPrefix || `[Transform][${uuid.v1()}]`;
        const { logPrefix } = this;
        this.transformFiles = transformFilePathList.map(path => new File_1.File(path, new codecs_1.Json(), "utf-8", encryptionModule).setParentLogPrefix(logPrefix));
        const { reloadFileMode, reloadFileInterval } = this.opts;
        if (reloadFileMode === TransformationOpts_1.ReloadFileMode.Interval) {
            if (!reloadFileInterval)
                throw new Error(`reloadFileInterval is required when reloadFileMode is ${TransformationOpts_1.ReloadFileMode.Interval}`);
            setInterval(() => {
                this.reloadAll(logPrefix);
            }, reloadFileInterval);
        }
    }
    initLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            const { logPrefix } = this;
            try {
                const { extensionFunctionsFolderPath } = this.opts;
                if (extensionFunctionsFolderPath) {
                    const classLoader = new ClassLoader_1.ClassLoader(extensionFunctionsFolderPath, { "*": true });
                    this.customFunctions = yield classLoader.load(logPrefix);
                    ExtensionableClass_1.ExtensionableClass.addBasicMethods(this.customFunctions);
                }
            }
            catch (error) {
                this.logger.error(`Some error happened trying to load extension functions. ${error}. Stack: ${error.stack}`, { logPrefix });
                throw error;
            }
            try {
                // Reload all table files
                if (GlobalFilesCollection_1.GlobalTablesCollection.isInited())
                    GlobalFilesCollection_1.GlobalTablesCollection.get().reloadAll(logPrefix);
                // Reload all transformation files
                const jsonGroups = this.loadGroupRulesFiles(logPrefix);
                if (jsonGroups)
                    this.parseGroupRulesFiles(jsonGroups, logPrefix);
            }
            catch (error) {
                this.logger.error(`Some error happened trying to load rules and/or tables files. ${error}. Stack: ${error.stack}`, { logPrefix });
                throw error;
            }
            return this;
        });
    }
    transformMessage(message, direction, groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageID } = message;
            const logPrefix = `${this.logPrefix}] [${messageID}`;
            this.logger.debug("[transformMsg] - Starting transformation process", { logPrefix });
            const initialMessage = message.body;
            let msgContext = {
                initialMessage,
                finalMessage: {},
                registry: { messageID, logPrefix },
            };
            if (this.opts.reloadFileMode === TransformationOpts_1.ReloadFileMode.Each)
                this.reloadAll(logPrefix);
            // Si no se logro cargar ningun archivo, o no tenemos ninguna regla de transformacion en los archivos cargados, no haremos ninguna transformacion
            if (Object.keys(this.groups).length === 0) {
                this.logger.error("[transformMsg] - Transformation file not found. It is required to operate.", { logPrefix });
                return {
                    action: Actions_1.MsgActions.ignoreMessage,
                    result: message.body,
                    transformed: false,
                };
            }
            this.logger.debug(`[transformMsg] - Initiate transformation process. Direction: ${direction}`, { logPrefix });
            // Solo logearemos el mensaje entrante en el nivel de TRACE
            if (this.logger.level == "TRACE")
                this.logger.trace(`[transformMsg] - Message to Transform: ${JSON.stringify(initialMessage)}`, { logPrefix });
            let isError = false, action = Actions_1.MsgActions.send, applied = false, result = { applied, ruleIndex: -1 };
            initialMessage.__msgKey = message.mainContextKey || message.altContextKey || messageID;
            initialMessage.__msgTransportData = Object.assign({}, message.transport);
            try {
                if (groupName) {
                    if (this.groups[groupName])
                        result = yield this.groups[groupName].group[direction].apply(msgContext);
                    else
                        action = Actions_1.MsgActions.doNothing;
                }
                else {
                    // Si no se fuerza un grupo de reglas particulares, recorreremos cada una de ellas, en al direccion requerida.
                    for (groupName in this.groups) {
                        result = yield this.groups[groupName].group[direction].apply(msgContext);
                        // Si una de ella nos informa que pudo ser aplicada en funcion de alguno de sus matchs, detendremos la busqueda para el resto
                        // Esta ejecucion puede ser detenida por el llamado a un paso de cambio de flujo
                        if (result.applied)
                            break;
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;
                ({ applied } = result);
                // Si pudimos aplicar alguno de los grupos existentes
                if (applied && groupName)
                    yield this.handleFlowSteps(message, msgContext, direction, groupName);
            }
            catch (error) {
                // Direccion en sentido de Error y flag activo de error
                isError = true;
                direction = "Error";
                this.logger.error(`[transformMsg] - The rule [${groupName}] found an error while it was being applied. ${error}`, { logPrefix });
                // Analizamos si se establecio una regla de error en particular
                const { errorRuleName } = msgContext.registry;
                if (errorRuleName) {
                    this.logger.trace(`[transformMsg] - Using Error direction of [${errorRuleName}] rule to handle this error `, { logPrefix });
                    if (!this.groups[errorRuleName]) {
                        this.logger.error(`[transformMsg] - Rule [${errorRuleName}] not found. Using the Error direction of the original rule [${groupName}]`, {
                            logPrefix,
                        });
                    }
                    else {
                        groupName = errorRuleName;
                    }
                }
                if (!groupName)
                    throw error;
                if (!this.groups[groupName].group[direction])
                    throw error;
                msgContext = {
                    initialMessage,
                    finalMessage: {},
                    registry: { messageID, logPrefix: this.logPrefix },
                };
                result = yield this.groups[groupName].group[direction].apply(msgContext);
                ({ applied } = result);
                if (applied && groupName)
                    yield this.handleFlowSteps(message, msgContext, direction, groupName);
            }
            delete msgContext.initialMessage.__msgTransportData;
            delete msgContext.initialMessage.__msgKey;
            delete msgContext.finalMessage.__msgTransportData;
            delete msgContext.finalMessage.__msgKey;
            const { autoReplyMessageOnce, ignoreMessage, closeConnection } = msgContext.registry;
            this.logger.trace(`[transformMsg] - Temporal registry for this message: ${JSON.stringify(msgContext.registry)}`, { logPrefix });
            if (applied) {
                if (autoReplyMessageOnce || isError)
                    action = Actions_1.MsgActions.autoReply;
                else if (ignoreMessage)
                    action = Actions_1.MsgActions.ignoreMessage;
                else if (closeConnection)
                    action = Actions_1.MsgActions.closeConnection;
                else
                    action = Actions_1.MsgActions.send;
                return { action, result: msgContext.finalMessage, transformed: true, groupName };
            }
            else {
                action = isError ? Actions_1.MsgActions.ignoreMessage : action;
                return { action, result: msgContext.initialMessage, transformed: false };
            }
        });
    }
    handleFlowSteps(message, msgContext, direction, groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageID } = message;
            const logPrefix = `${this.logPrefix}] [${messageID}`;
            const stack = [];
            // Revisaremos si alguno de los pasos de ese grupo indica que debemos ejecutar otro grupo en especifico,
            // ya sea como llamado sincronico, o abandonando el grupo inicial, o la direccion de AutoReply del grupo en curso
            let { while: whileStep, goToError, goToAutoReply, goToRuleName, callToRuleName, forEach, forIn, for: forStep, restOfStepsArray, finishRule, } = msgContext.registry;
            let keepLoop = goToError || goToAutoReply || goToRuleName || callToRuleName || forEach || forIn || forStep || whileStep || finishRule || stack.length;
            // Si la nueva regla o direccion que ejecutamos nos indica que debemos hacerlo nuevamente, lo haremos
            while (keepLoop) {
                msgContext.registry = Object.assign(Object.assign({}, msgContext.registry), { goToAutoReply: undefined, goToRuleName: undefined, callToRuleName: undefined, forEach: undefined, forIn: undefined, for: undefined, while: undefined, restOfStepsArray: undefined, finishRule: undefined, goToError: undefined });
                if (finishRule) {
                    // Doing nothing else here
                }
                else if (whileStep && restOfStepsArray !== undefined) {
                    for (let i = restOfStepsArray.length - 1; i > -1; i--)
                        stack.push({ actualGroupName: groupName, remainingSteps: restOfStepsArray[i] });
                    const { conditionalSource, ruleName } = whileStep;
                    const wholeGroup = this.groups[ruleName];
                    if (!wholeGroup) {
                        this.logger.error(`[transformMsg] - The rule [${ruleName}] was not found`, { logPrefix });
                        throw new Error(`The rule [${ruleName}] executed by a While function was not found`);
                    }
                    let { execAgain } = conditionalSource;
                    while (execAgain) {
                        const result = yield wholeGroup.group[direction].directApply(msgContext);
                        const { applied } = result;
                        if (applied && ruleName) {
                            yield this.handleFlowSteps(message, msgContext, direction, ruleName);
                        }
                        // eslint-disable-next-line @typescript-eslint/no-extra-semi
                        ;
                        ({ execAgain } = conditionalSource);
                    }
                }
                else if (forStep && restOfStepsArray !== undefined) {
                    for (let i = restOfStepsArray.length - 1; i > -1; i--)
                        stack.push({ actualGroupName: groupName, remainingSteps: restOfStepsArray[i] });
                    const { initValue, maxValue, ruleName } = forStep;
                    const wholeGroup = this.groups[ruleName];
                    if (!wholeGroup) {
                        this.logger.error(`[transformMsg] - The rule [${ruleName}] was not found`, { logPrefix });
                        throw new Error(`The rule [${ruleName}] executed by a For function was not found`);
                    }
                    for (let arrayIndex = initValue; arrayIndex < maxValue; arrayIndex++) {
                        const result = yield wholeGroup.group[direction].directApply(msgContext);
                        const { applied } = result;
                        if (applied && ruleName)
                            yield this.handleFlowSteps(message, msgContext, direction, ruleName);
                    }
                }
                else if (forEach && restOfStepsArray !== undefined) {
                    for (let i = restOfStepsArray.length - 1; i > -1; i--)
                        stack.push({ actualGroupName: groupName, remainingSteps: restOfStepsArray[i] });
                    const { sourceArray, ruleName } = forEach;
                    const wholeGroup = this.groups[ruleName];
                    if (!wholeGroup) {
                        this.logger.error(`[transformMsg] - The rule [${ruleName}] was not found`, { logPrefix });
                        throw new Error(`The rule [${ruleName}] executed by a ForEach function was not found`);
                    }
                    for (let arrayIndex = 0; arrayIndex < sourceArray.length; arrayIndex++) {
                        // Give access to the actual array element
                        msgContext.initialMessage.__elementIndex = arrayIndex;
                        msgContext.initialMessage.__elementValue = sourceArray[arrayIndex];
                        const result = yield wholeGroup.group[direction].directApply(msgContext);
                        const { applied } = result;
                        if (applied && ruleName)
                            yield this.handleFlowSteps(message, msgContext, direction, ruleName);
                        // Delete access to the actual array element
                        delete msgContext.initialMessage.__elementIndex;
                        delete msgContext.initialMessage.__elementValue;
                    }
                }
                else if (forIn && restOfStepsArray !== undefined) {
                    for (let i = restOfStepsArray.length - 1; i > -1; i--)
                        stack.push({ actualGroupName: groupName, remainingSteps: restOfStepsArray[i] });
                    const { sourceObj, ruleName } = forIn;
                    const wholeGroup = this.groups[ruleName];
                    if (!wholeGroup) {
                        this.logger.error(`[transformMsg] - The rule [${ruleName}] was not found`, { logPrefix });
                        throw new Error(`The rule [${ruleName}] executed by a ForIn function was not found`);
                    }
                    for (const elementName in sourceObj) {
                        // Give access to the actual array element
                        msgContext.initialMessage.__elementName = elementName;
                        msgContext.initialMessage.__elementValue = sourceObj[elementName];
                        const result = yield wholeGroup.group[direction].directApply(msgContext);
                        const { applied } = result;
                        if (applied && ruleName)
                            yield this.handleFlowSteps(message, msgContext, direction, ruleName);
                        // Delete access to the actual array element
                        delete msgContext.initialMessage.__elementName;
                        delete msgContext.initialMessage.__elementValue;
                    }
                }
                else if (typeof callToRuleName === "string" && restOfStepsArray !== undefined) {
                    for (let i = restOfStepsArray.length - 1; i > -1; i--)
                        stack.push({ actualGroupName: groupName, remainingSteps: restOfStepsArray[i] });
                    groupName = callToRuleName;
                    const wholeGroup = this.groups[callToRuleName];
                    if (!wholeGroup) {
                        this.logger.error(`[transformMsg] - The rule [${callToRuleName}] was not found`, { logPrefix });
                        throw new Error(`The rule [${callToRuleName}] executed by a CallTo function was not found`);
                    }
                    yield wholeGroup.group[direction].directApply(msgContext);
                }
                else if (goToAutoReply) {
                    direction = "AutoReply";
                    const autoReplyGroup = this.groups[groupName].group[direction];
                    if (!autoReplyGroup) {
                        this.logger.error("[transformMsg] -  AutoReply direction is not defined!", { logPrefix });
                        throw new Error(`AutoReply direction is not defined`);
                    }
                    yield autoReplyGroup.directApply(msgContext);
                }
                else if (goToError) {
                    direction = "Error";
                    const errorGroup = this.groups[groupName].group[direction];
                    if (!errorGroup) {
                        this.logger.error("[transformMsg] -  Error direction is not defined!", { logPrefix });
                        throw new Error(`Error direction is not defined`);
                    }
                    yield errorGroup.directApply(msgContext);
                }
                else if (goToRuleName) {
                    const wholeGroup = this.groups[goToRuleName];
                    if (!wholeGroup) {
                        this.logger.error(`[transformMsg] - The rule [${goToRuleName}] was not found`, { logPrefix });
                        throw new Error(`The rule [${callToRuleName}] executed by a GoTo function was not found`);
                    }
                    yield wholeGroup.group[direction].directApply(msgContext);
                }
                else if (stack.length) {
                    const { actualGroupName, remainingSteps } = stack.pop() || {};
                    if (remainingSteps && actualGroupName) {
                        groupName = actualGroupName;
                        yield TransformationRule_1.TransformationRule.runSteps(remainingSteps, msgContext);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;
                ({
                    goToError,
                    goToAutoReply,
                    goToRuleName,
                    callToRuleName,
                    forEach,
                    forIn,
                    for: forStep,
                    while: whileStep,
                    restOfStepsArray,
                    finishRule,
                } = msgContext.registry);
                keepLoop = goToError || goToAutoReply || goToRuleName || callToRuleName || forEach || forIn || forStep || whileStep || finishRule || stack.length;
            }
        });
    }
    loadGroupRulesFiles(logPrefix) {
        const changeFound = this.transformFiles.reduce((changeFound, file) => file.load(logPrefix) || changeFound, false);
        if (changeFound) {
            this.logger.debug(`[loadGroupRulesFiles] - Loading transformation files and putting them into only one file. Files qty: [${this.transformFiles.length}]`, { logPrefix });
            return this.transformFiles.reduce((newUnits, file) => {
                try {
                    const fileContent = file.getContent("utf-8");
                    if (fileContent) {
                        const jsonFile = this.validateFile(fileContent);
                        this.logger.trace(`[loadGroupRulesFiles] - The transformation file [${file.getPath()}] was converted to JSON object`, {
                            logPrefix,
                        });
                        if (jsonFile.Transformation) {
                            newUnits.Transformation = Object.assign(Object.assign({}, newUnits.Transformation), jsonFile.Transformation);
                            this.logger.trace(`[loadGroupRulesFiles] - The transformation file [${file.getPath()}] was concated`, {
                                logPrefix,
                            });
                        }
                        else {
                            this.logger.error(`[loadGroupRulesFiles] - The transformation file has not Transformation root element`, {
                                logPrefix,
                            });
                        }
                    }
                    else {
                        this.logger.warn(`[loadGroupRulesFiles] - The transformation file [${file.getPath()}] is empty.`, {
                            logPrefix,
                        });
                    }
                }
                catch (error) {
                    this.logger.error(`[loadGroupRulesFiles] - The transformation file [${file.getPath()}] could NOT be load.`, {
                        logPrefix,
                    });
                    this.logger.error(error);
                }
                return newUnits;
            }, { Transformation: {} });
        }
        else {
            this.logger.debug("[loadGroupRulesFiles] - No changes were detected on files", { logPrefix });
        }
        return null;
    }
    parseGroupRulesFiles(jsonGroups, logPrefix) {
        for (const groupName in jsonGroups.Transformation) {
            const groupValue = jsonGroups.Transformation[groupName];
            this.groups[groupName] = TransformationGroup_1.TransformationGroup.fromObject(groupValue, this.customFunctions);
        }
    }
}
exports.Transformation = Transformation;
