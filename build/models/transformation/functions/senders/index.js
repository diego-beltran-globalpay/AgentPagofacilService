"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendersFuncAvb = void 0;
const SendByHttp_1 = require("./SendByHttp");
const SendToEndpoint_1 = require("./SendToEndpoint");
const SendRawDataToEndpoint_1 = require("./SendRawDataToEndpoint");
exports.sendersFuncAvb = {
    SendByHttp: SendByHttp_1.SendByHttp,
    SendToEndpoint: SendToEndpoint_1.SendToEndpoint,
    SendRawDataToEndpoint: SendRawDataToEndpoint_1.SendRawDataToEndpoint,
};
