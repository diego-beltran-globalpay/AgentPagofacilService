"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementMappingProps = void 0;
exports.ElementMappingProps = [
    {
        propName: "clientElementMappingBfTransf",
        defaultValue: "Client,L2R",
        description: "Element mapping group and direction to apply to client msg before transformation process is executed",
    },
    {
        propName: "clientElementMappingAfTransf",
        defaultValue: "Client,R2L",
        description: "Element mapping group and direction to apply to client msg after transformation process is executed",
    },
    {
        propName: "targetElementMappingBfTransf",
        defaultValue: "Target,L2R",
        description: "Element mapping group and direction to apply to target msg before transformation process is executed",
    },
    {
        propName: "targetElementMappingAfTransf",
        defaultValue: "Target,R2L",
        description: "Element mapping group and direction to apply to target msg after transformation process is executed",
    },
    {
        propName: "loadElementMappingOnce",
        defaultValue: false,
        description: "Indicate if the map file will be loaded once or per each transaction",
    },
    {
        propName: "elementMappingFilePath",
        defaultValue: "",
        description: "Path of the files to initiate this module. Each path must be separated by a comma (,)",
    },
];
