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
exports.SendByHttp = void 0;
const https_1 = __importDefault(require("https"));
const SendByHttpITF_1 = require("./SendByHttpITF");
const SendByHttpITF_validator_1 = __importDefault(require("./SendByHttpITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
let axios;
class SendByHttp extends FunctionModel_1.FunctionModel {
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!axios)
                throw new Error(`You have to enable axios module first.`);
            const { registry: { logPrefix }, } = contexts;
            const { fieldNameSource, hostnameNameSource, portNameSource, pathNameSource, timeoutSecsNameSource, isSecure, method } = this.props;
            const sourceData = (yield this.accessor.get(fieldNameSource, contexts)) || {};
            const hostname = yield this.accessor.get(hostnameNameSource, contexts);
            const port = yield this.accessor.get(portNameSource, contexts);
            const path = yield this.accessor.get(pathNameSource, contexts);
            const timeoutSecs = yield this.accessor.get(timeoutSecsNameSource, contexts);
            if (typeof sourceData !== "object")
                throw new Error("The request is not an object");
            if (!hostname || typeof hostname !== "string")
                throw new Error("The hostname is empty or is not a string");
            if (!port || isNaN(parseInt(port)))
                throw new Error("The port is empty or is not a number");
            if (!timeoutSecs || isNaN(parseInt(timeoutSecs)))
                throw new Error("The timeout is empty or is not a number");
            const { _http: { headers = {} } = {} } = sourceData;
            delete sourceData._http;
            const msgToSend = JSON.stringify(sourceData);
            this.logger.debug(`[ SendByHttp ] - We will send ${method === "post" ? `a POST request with this message [${msgToSend}]` : "a GET request"}`, {
                logPrefix,
            });
            const options = {
                timeout: timeoutSecs * 1000,
                headers: Object.assign(Object.assign({ "Content-Type": "application/json" }, (method === "post" ? { "Content-Length": msgToSend.length } : {})), headers),
            };
            if (isSecure) {
                const agent = new https_1.default.Agent({
                    host: hostname,
                    port: port,
                    path: path,
                    rejectUnauthorized: false,
                });
                options.httpsAgent = agent;
            }
            this.logger.debug(`[ SendByHttp ] - Request will be send in Secure mode ${isSecure}`, { logPrefix });
            const endpoint = `${isSecure ? "https://" : "http://"}${hostname}:${port}${path}`;
            this.logger.debug(`[ SendByHttp ] - The endpoint is ${endpoint}. Options: ${JSON.stringify(options)}`, { logPrefix });
            try {
                const response = method === "post" ? yield axios.default.post(endpoint, sourceData, options) : yield axios.default.get(endpoint, options);
                this.logger.trace(`[ SendByHttp ] - The service did respond to our request.`, {
                    logPrefix,
                });
                const { data, status, statusText, headers } = response;
                return { data, status, statusText, headers };
            }
            catch (error) {
                const { response, request, message } = error;
                if (response) {
                    this.logger.error(`[ SendByHttp ] - The service did respond to our request, but the HTTP response code is ${response.status}.`, { logPrefix });
                    const { data, status, statusText, headers } = response;
                    return { data, status, statusText, headers };
                }
                else if (request) {
                    this.logger.error(`[ SendByHttp ] - The service did not respond to our request`, { logPrefix });
                    return { status: "NO_RESPONSE" };
                }
                else {
                    this.logger.error(`[ SendByHttp ] - An error was found when we try to send the message. Error: ${message}`, {
                        logPrefix,
                    });
                    return { status: "REQUEST_ERROR" };
                }
            }
        });
    }
}
exports.SendByHttp = SendByHttp;
SendByHttp.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, SendByHttpITF_1.fieldsNameMappigns, SendByHttpITF_validator_1.default);
    return new SendByHttp(params);
};
SendByHttp.init = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!axios)
        axios = yield Promise.resolve().then(() => __importStar(require("axios")));
});
