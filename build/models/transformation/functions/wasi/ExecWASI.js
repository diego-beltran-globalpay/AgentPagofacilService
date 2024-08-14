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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecWASI = void 0;
const fs_1 = __importDefault(require("fs"));
const ExecWASIITF_1 = require("./ExecWASIITF");
const ExecWASIITF_validator_1 = __importDefault(require("./ExecWASIITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
let wasi;
class ExecWASI extends FunctionModel_1.FunctionModel {
    constructor(props) {
        super(props);
        const { wasiInstance: localWasiInst, scriptArgs = process.argv, preOpens = {} } = this.props;
        if (!wasi)
            throw new Error(`You have to enable wasi module first.`);
        this.wasiInstance =
            localWasiInst ||
                new wasi({
                    args: scriptArgs,
                    env: process.env,
                    preopens: preOpens,
                });
        const { scriptFilePath, scriptFile: localScriptFile } = this.props;
        this.scriptFile = localScriptFile || (scriptFilePath && fs_1.default.existsSync(scriptFilePath) ? fs_1.default.readFileSync(scriptFilePath) : Buffer.alloc(0));
        if (!this.scriptFile.length) {
            throw new Error("Script file is not present. You can give the file loaded or the path to find it.");
        }
    }
    getWasmModule(scriptFile) {
        return WebAssembly.compile(scriptFile);
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            let { wasmModule } = this;
            if (!wasmModule) {
                this.logger.trace(`[ ExecWASI ] - Compiling the WASI script.`, { logPrefix });
                this.wasmModule = yield this.getWasmModule(this.scriptFile);
            }
            this.logger.trace(`[ ExecWASI ] - Instantiating and executing the WASI script.`, { logPrefix });
            ({ wasmModule } = this);
            if (wasmModule) {
                this.logger.trace(`[ ExecWASI ] - Instantiating the WASI script`, { logPrefix });
                const importObject = { wasi_snapshot_preview1: this.wasiInstance.wasiImport };
                const scriptInstance = yield WebAssembly.instantiate(wasmModule, importObject);
                this.logger.trace(`[ ExecWASI ] - Executing the WASI script`, { logPrefix });
                this.wasiInstance.start(scriptInstance);
                this.logger.trace(`[ ExecWASI ] - WASI script finished`, { logPrefix });
            }
            else {
                throw new Error("This WebAssembly script could not be compiled.");
            }
        });
    }
}
exports.ExecWASI = ExecWASI;
ExecWASI.init = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!wasi) {
        const module = yield Promise.resolve().then(() => __importStar(require("wasi")));
        ({ WASI: wasi } = module);
    }
});
ExecWASI.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ExecWASIITF_1.fieldsNameMappigns, ExecWASIITF_validator_1.default);
    const scriptArgs = [];
    Object.keys(params).forEach((name) => {
        const param = params[name];
        if (name.substr(0, 10) === "param_")
            scriptArgs.push(String(param));
    });
    const { scriptFilePath } = params;
    if (!scriptFilePath || !fs_1.default.existsSync(scriptFilePath))
        throw new Error("The script file was not found");
    const execWASI = new ExecWASI({ scriptFile: fs_1.default.readFileSync(scriptFilePath), scriptArgs });
    execWASI
        .getWasmModule(execWASI.scriptFile)
        .then((createdWasmModule) => {
        execWASI.wasmModule = createdWasmModule;
    })
        .catch(error => {
        execWASI.logger.error(`There was an error compiling the WASI module [${execWASI.props.scriptFilePath}]. Error: [${error}]`);
    });
    return execWASI;
};
