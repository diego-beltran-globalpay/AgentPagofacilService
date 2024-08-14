"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureOptions = void 0;
const constants_1 = require("constants");
exports.secureOptions = constants_1.SSL_OP_NO_SSLv2 | constants_1.SSL_OP_NO_SSLv3 | constants_1.SSL_OP_NO_TLSv1 | constants_1.SSL_OP_NO_TLSv1_1;
