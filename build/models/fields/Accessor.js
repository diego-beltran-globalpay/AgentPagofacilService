"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accessor = void 0;
const StaticAccessor_1 = require("./StaticAccessor");
const DynamicAccessor_1 = require("./DynamicAccessor");
class Accessor {
    constructor(staticCtxsByPrefixRef, dynamicCtxsByPrefixRef) {
        this.static = new StaticAccessor_1.StaticAccessor(staticCtxsByPrefixRef);
        this.dynamic = new DynamicAccessor_1.DynamicAccessor(dynamicCtxsByPrefixRef);
    }
    isContextRef(prefix = "") {
        return this.static.isContextRef(prefix) || this.dynamic.isContextRef(prefix);
    }
    get(parameter, contexts) {
        const result = this.static.isContextRef(parameter)
            ? this.static.get(parameter, contexts)
            : this.dynamic.isContextRef(parameter)
                ? this.dynamic.get(parameter)
                : parameter;
        return result;
    }
    set(parameter, value, contexts) {
        return this.dynamic.isContextRef(parameter) ? this.dynamic.set(parameter, value) : this.static.set(parameter, value, contexts);
    }
    delete(parameter, contexts) {
        return this.dynamic.isContextRef(parameter) ? this.dynamic.delete(parameter) : this.static.delete(parameter, contexts);
    }
}
exports.Accessor = Accessor;
