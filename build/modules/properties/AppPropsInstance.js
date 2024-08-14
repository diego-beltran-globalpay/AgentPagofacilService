"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPropsInstance = void 0;
const AppProperties_1 = require("./AppProperties");
class AppPropsInstance {
    static getInstance() {
        if (!this.instance) {
            this.instance = new AppProperties_1.AppProperties();
        }
        return this.instance;
    }
}
exports.AppPropsInstance = AppPropsInstance;
