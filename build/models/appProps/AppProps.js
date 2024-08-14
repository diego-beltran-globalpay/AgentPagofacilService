"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppProps = exports.CUSTOM_PROPS = void 0;
const node_getopt_1 = __importDefault(require("@asap-technology/node-getopt"));
const ini_1 = __importDefault(require("ini"));
const fs_1 = __importDefault(require("fs"));
const CustomPropModel_validator_1 = __importDefault(require("./CustomPropModel.validator"));
const ValueParser_1 = require("../utils/ValueParser");
exports.CUSTOM_PROPS = "CustomProps";
class AppProps {
    constructor(propsByModule) {
        this.propsByModule = propsByModule;
        this.cmdLineOpt = {};
        this.iniOpt = {};
        this.loadPropsFromCmdLine();
        this.loadPropsFromIni();
    }
    setKeyStore(localKeyStore) {
        this.keyStoreInst = localKeyStore;
    }
    parseProperties(moduleName) {
        const requestedProps = {};
        const { [moduleName]: { props: currentOptProps, validate }, } = this.propsByModule;
        if (currentOptProps) {
            for (const { propName, defaultValue, type } of currentOptProps) {
                if (typeof propName === "string") {
                    let tmp;
                    if (process.env[propName] !== undefined && process.env[propName] !== "")
                        tmp = process.env[propName];
                    else if (this.cmdLineOpt[propName] !== undefined && this.cmdLineOpt[propName] !== "")
                        tmp = this.cmdLineOpt[propName];
                    else if (this.iniOpt[propName] !== undefined && this.iniOpt[propName] !== "")
                        tmp = this.iniOpt[propName];
                    else
                        tmp = defaultValue;
                    const value = this.handleValue(type, tmp);
                    if (this.keyStoreInst && this.keyStoreInst.isSecret(String(value))) {
                        this.keyStoreInst.decryptSecret(value, {});
                    }
                    requestedProps[propName] = value;
                }
            }
            validate(requestedProps);
            return requestedProps;
        }
        else {
            throw new Error("The module properties where not found");
        }
    }
    loadPropsFromCmdLine() {
        // Parametros posibles en la ejecucion de este modulo, con su help. En el se encuentran los del Core, junto con los de la Extension
        const getopt = new node_getopt_1.default(this.preloadPropsFromCmdLine()).bindHelp();
        // Seteamos el help configurado arriba
        getopt.setHelp("Usage: node Kernel.js [OPTION]\n" + "\n" + "[[OPTIONS]]\n" + "\n");
        const cmdLineOptsParsed = getopt.parse(process.argv.slice(2));
        // Metodo de asignacion de los valores pasados por parametro en el comando de ejecucion, con sus correspondientes variables
        if (cmdLineOptsParsed.options.help) {
            getopt.showHelp();
            process.exit(0);
        }
        else {
            this.cmdLineOpt = cmdLineOptsParsed.options;
        }
    }
    preloadPropsFromCmdLine() {
        let optArray = [];
        const isPropAlreadySet = {};
        let customProps = [];
        for (const module in this.propsByModule)
            optArray = [...optArray, ...this.parseOptArray(isPropAlreadySet, this.propsByModule[module].props)];
        const cmdLineOptsParsed = new node_getopt_1.default(optArray).parseIgnore(process.argv.slice(2));
        const { customPropsDefinitionFilePath } = cmdLineOptsParsed.options;
        if (customPropsDefinitionFilePath && typeof customPropsDefinitionFilePath === "string") {
            if (!fs_1.default.existsSync(customPropsDefinitionFilePath))
                throw new Error(`The custom properties config file was not found in [${customPropsDefinitionFilePath}]`);
            ({ Properties: customProps } = CustomPropModel_validator_1.default(JSON.parse(fs_1.default.readFileSync(customPropsDefinitionFilePath, "utf-8"))));
            optArray = [...optArray, ...this.parseOptArray(isPropAlreadySet, customProps)];
        }
        this.propsByModule[exports.CUSTOM_PROPS] = {
            props: customProps,
            validate: value => {
                return true;
            },
        };
        return optArray;
    }
    loadPropsFromIni() {
        const { useConfigIni = false, configIniPath = "./" } = this.cmdLineOpt;
        if (Boolean(useConfigIni)) {
            if (fs_1.default.existsSync(configIniPath)) {
                this.iniOpt = ini_1.default.parse(fs_1.default.readFileSync(configIniPath, "utf-8")).options;
            }
        }
    }
    parseOptArray(isPropAlreadySet, propsArray) {
        return propsArray.reduce((newArray, { propName, country = "ARG", shortcut = "", defaultValue, description = "" }) => {
            if (typeof propName === "string" && !isPropAlreadySet[propName]) {
                newArray.push([
                    shortcut,
                    `${propName}=${country}`,
                    `${description}. ${defaultValue !== undefined ? `Default: ${defaultValue}` : "No default value."}`,
                ]);
                isPropAlreadySet[propName] = true;
            }
            return newArray;
        }, []);
    }
    handleValue(type, value) {
        if (value === undefined || value === null)
            return value;
        if (type && new RegExp(/\[\]$/).test(type)) {
            return value
                .toString()
                .split("|")
                .map((val) => {
                return ValueParser_1.ValueParser.parseValue(type, val);
            });
        }
        else {
            return ValueParser_1.ValueParser.parseValue(type, value);
        }
    }
}
exports.AppProps = AppProps;
