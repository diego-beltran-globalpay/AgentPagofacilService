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
exports.ReadFileByBlock = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const ReadFileByBlockITF_1 = require("./ReadFileByBlockITF");
const ReadFileByBlockITF_validator_1 = __importDefault(require("./ReadFileByBlockITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const fsExists = util_1.default.promisify(fs_1.default.exists);
const fsReadFile = util_1.default.promisify(fs_1.default.readFile);
class ReadFileByBlock extends FunctionModel_1.FunctionModel {
    constructor(props) {
        super(props);
        this.loadFile = (filePath = "") => __awaiter(this, void 0, void 0, function* () {
            const exists = yield fsExists(filePath);
            if (!exists) {
                this.logger.trace(`[ ReadFileByBlock ][ loadFile ] - The file with path [${filePath}] was not found`);
                return;
            }
            try {
                this.logger.trace(`[ ReadFileByBlock ][ loadFile ] - The file [${filePath}] was found`);
                this.props.file = yield fsReadFile(filePath);
                this.logger.trace(`[ ReadFileByBlock ][ loadFile ] - The file [${filePath}] was loaded`);
            }
            catch (error) {
                this.logger.error(`[ ReadFileByBlock ][ loadFile ] - The file [${filePath}] could not be load.`);
                this.logger.error(error);
                throw new Error("One of the files could not be load");
            }
        });
        if (props.filePath)
            this.loadFile(this.props.filePath);
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { blockSize, blockIndex, encoding = "base64", filePath = "" } = this.props;
            let { file } = this.props;
            this.logger.trace(`[ ReadFileByBlock ] - The file path is [${filePath}]`, { logPrefix });
            this.logger.trace(`[ ReadFileByBlock ] - The block size is [${blockSize}]. ${blockIndex !== undefined ? `The block index to get is ${blockIndex} with an encoding [${encoding}]` : ""}`, { logPrefix });
            if (!file)
                yield this.loadFile(filePath);
            ({ file } = this.props);
            if (file) {
                const result = {
                    FileSize: file.length,
                    BlocksQty: Math.ceil(file.length / blockSize),
                };
                if (blockIndex) {
                    const blockRead = file.subarray(blockSize * blockIndex, blockSize * blockIndex + blockSize);
                    result.Block = blockRead.toString(encoding);
                    result.BlockSize = blockRead.length;
                }
                return result;
            }
            else {
                this.logger.error(`[ ReadFileByBlock ] - The file was not found.`, { logPrefix });
            }
        });
    }
}
exports.ReadFileByBlock = ReadFileByBlock;
ReadFileByBlock.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, ReadFileByBlockITF_1.fieldsNameMappigns, ReadFileByBlockITF_validator_1.default);
    return new ReadFileByBlock(params);
};
