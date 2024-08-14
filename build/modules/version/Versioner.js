"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Versioner = void 0;
const fs_1 = require("fs");
const LoggersColletion_1 = require("../logger/LoggersColletion");
class Versioner {
    static getVersion() {
        const version = fs_1.existsSync(this.filePath) ? fs_1.readFileSync(this.filePath, "utf-8") : "";
        return version === "" ? "development" : version;
    }
    static printVersion() {
        const version = fs_1.existsSync(this.filePath) ? fs_1.readFileSync(this.filePath, "utf-8") : "";
        const label = `[Versioner] - Application Kernel Version: ${version === "" ? "development" : version}`;
        if (LoggersColletion_1.LoggerInstance.isIniated())
            LoggersColletion_1.LoggerInstance.getInstance().info(label);
        else
            console.log(label);
    }
}
exports.Versioner = Versioner;
Versioner.filePath = "./VERSION.md";
