"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesCollection = void 0;
const codecs_1 = require("../protocol/codecs");
const File_1 = require("./File");
class FilesCollection {
    constructor(filesIds, filesPath, filesEncoding) {
        this.files = {};
        this.reloadAll = (logPrefix) => Object.values(this.files).forEach(file => file.load(logPrefix));
        this.reloadFile = (id, logPrefix) => (this.files[id] ? this.files[id].load(logPrefix) : false);
        this.getFile = (id) => (this.files[id] ? this.files[id].getContent() : null);
        this.getFileWithReloading = (id, logPrefix) => {
            if (this.files[id]) {
                this.files[id].load(logPrefix);
                return this.files[id].getContent();
            }
            return null;
        };
        if (filesIds.length !== filesPath.length)
            throw new Error("The file ids qty and paths are not equal");
        let defaultFileEncoding;
        if (filesEncoding.length === 1)
            defaultFileEncoding = filesEncoding[0];
        else if (filesIds.length !== filesEncoding.length)
            throw new Error("The file ids qty and encoding are not equal");
        filesIds.forEach((fileId, index) => {
            this.files[fileId] = new File_1.File(filesPath[index], new codecs_1.Json(), defaultFileEncoding || filesEncoding[index]);
        });
    }
}
exports.FilesCollection = FilesCollection;
