"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppKeyStoreProps = void 0;
exports.AppKeyStoreProps = [
    {
        propName: "secureStorePrivFilePath",
        type: "string",
        defaultValue: "",
        description: "Private key file path required to create the secure store",
    },
    {
        propName: "secureStorePubFilePath",
        type: "string",
        defaultValue: "",
        description: "Public key file path required to create the secure store",
    },
    {
        propName: "secureStoreKeyPassphrase",
        type: "string",
        defaultValue: undefined,
        description: "Passphrase to open private key, if it requires one",
    },
    {
        propName: "secureStoreKeysPadding",
        type: "integer",
        defaultValue: 1,
        description: "Private and public pair keys padding format",
    },
    {
        propName: "secureStoreKeysFormat",
        type: "string",
        defaultValue: "pkcs1",
        description: "Private and public pair keys format",
    },
];
