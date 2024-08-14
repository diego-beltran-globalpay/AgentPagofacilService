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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const fs_1 = __importDefault(require("fs"));
const uuid = __importStar(require("uuid"));
const LoggersColletion_1 = require("../logger/LoggersColletion");
const RouterFile_1 = require("./RouterFile");
const RouterFile_validator_1 = __importDefault(require("./RouterFile.validator"));
const RouterCtxAccessor_1 = require("./RouterCtxAccessor");
const RouterFieldHolder_1 = require("./RouterFieldHolder");
const ComparisonOperator_1 = require("../../models/operators/comparisonOperators/ComparisonOperator");
const RegexOperator_1 = require("../../models/operators/RegexOperator");
class Router {
    constructor(switchRulesFilePath, reloadFileSecs, logPrefix) {
        this.switchRulesFilePath = switchRulesFilePath;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[Router][${uuid.v1()}]`;
        this.accessor = RouterCtxAccessor_1.RouterCtxAccessorInst.getInstance();
        this.rulesByGroup = {};
        this.setLogPrefix = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
            return this;
        };
        if (logPrefix)
            this.logPrefix = logPrefix;
        this.parseFile(this.load());
        if (reloadFileSecs) {
            setInterval(() => {
                this.load();
            }, reloadFileSecs * 1000);
        }
    }
    route(message) {
        const { logPrefix: staticLogPrefix } = this;
        const { body, messageID } = message;
        const logPrefix = `[${staticLogPrefix}][${messageID}]`;
        for (const hostsGroupID in this.rulesByGroup) {
            const rulesGroups = this.rulesByGroup[hostsGroupID];
            this.logger.debug(`Start to check if this message will be send to [${hostsGroupID}]`, { logPrefix });
            // Host para derivar por default, si no tiene campos para verificar, salimos por aqui
            if (!rulesGroups.length) {
                this.logger.debug(`The group id found is the default one (match rules empty). Value: [${hostsGroupID}]`, { logPrefix });
                return hostsGroupID;
            }
            const isPassed = rulesGroups.some(ruleSet => {
                this.logger.debug(`Start new group of rule to check`, { logPrefix });
                return ruleSet.every(rule => {
                    const { Field, Operator } = rule;
                    if (Operator instanceof ComparisonOperator_1.ComparisonOperator) {
                        return Operator.compare(Field.get({ context: body }), null, { logPrefix: messageID });
                    }
                    else {
                        return Operator.apply(Field.get({ context: body }), { logPrefix: messageID });
                    }
                });
            });
            if (isPassed) {
                this.logger.debug(`The group id found is [${hostsGroupID}]`, { logPrefix });
                return hostsGroupID;
            }
            else {
                this.logger.debug(`The group id was not applicable to this message`, { logPrefix });
            }
        }
        throw new Error("GroupID not found");
    }
    load() {
        const { logPrefix } = this;
        if (!fs_1.default.existsSync(this.switchRulesFilePath))
            throw new Error("The switch file is required. It was not found!");
        try {
            const fileLoaded = JSON.parse(fs_1.default.readFileSync(this.switchRulesFilePath, "utf-8"));
            this.logger.debug(`The switch file was load. File path: [${this.switchRulesFilePath}]`, { logPrefix });
            return RouterFile_validator_1.default(fileLoaded);
        }
        catch (error) {
            this.logger.error(`An error was found trying to read the switch file`, { logPrefix });
            throw error;
        }
    }
    parseFile(fileLoaded) {
        const groupRules = {};
        for (const groupID in fileLoaded) {
            const rules = fileLoaded[groupID].map((rule) => {
                return rule.Fields.map((fieldComparison) => {
                    const { FieldToCompare, Start, Length } = fieldComparison;
                    let Operator;
                    if (RouterFile_1.isComparisonOperator(fieldComparison)) {
                        const { LogicalOperator, Value } = fieldComparison;
                        Operator = ComparisonOperator_1.ComparisonOperator.fromString(LogicalOperator, Value);
                    }
                    else if (RouterFile_1.isRegexOperator(fieldComparison)) {
                        const { Expression } = fieldComparison;
                        Operator = new RegexOperator_1.RegexOperator(new RegExp(Expression), false);
                    }
                    else {
                        const { Value } = fieldComparison;
                        Operator = ComparisonOperator_1.ComparisonOperator.fromString("=", Value);
                    }
                    return { Field: new RouterFieldHolder_1.RouterFieldHolder(FieldToCompare, Start, Length), Operator };
                });
            });
            groupRules[groupID] = rules;
        }
        this.rulesByGroup = groupRules;
    }
}
exports.Router = Router;
