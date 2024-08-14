"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsNameMappigns = void 0;
var ToDecodeTypes;
(function (ToDecodeTypes) {
    ToDecodeTypes["CardNumber"] = "Card";
    ToDecodeTypes["ExpirationDate"] = "ExpDate";
})(ToDecodeTypes || (ToDecodeTypes = {}));
exports.fieldsNameMappigns = {
    DataSource: {
        position: 0,
        name: "agregator",
        type: "string",
    },
    RazonSocial: {
        position: 1,
        name: "razonsocialName",
        type: "string",
    },
    Direccion: {
        position: 2,
        name: "direccionName",
        type: "string",
    },
    Telefono: {
        position: 3,
        name: "telefono",
        type: "string",
    },
    Email: {
        position: 4,
        name: "email",
        type: "string",
    },
    CodPosName: {
        position: 5,
        name: "codposName",
        type: "string",
    },
    DataType: {
        position: 6,
        name: "regionCode",
        type: "string",
    },
    CountryCode: {
        position: 7,
        name: "countryCode",
        type: "string",
    },
    RazonSocialDefault: {
        position: 8,
        name: "razonsocialDefault",
        type: "string",
    },
    DireccionDefault: {
        position: 9,
        name: "direccionDefault",
        type: "string",
    },
    CodPosDefault: {
        position: 10,
        name: "codposDefault",
        type: "string",
    },
};
