"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = exports.firstLetterToUppercase = exports.fileNamePascalCase = exports.pascalCase = void 0;
const lodash_1 = require("lodash");
const pascalCase = (str) => (0, lodash_1.camelCase)(`${str}`);
exports.pascalCase = pascalCase;
const fileNamePascalCase = (str) => {
    return (0, exports.firstLetterToUppercase)((0, exports.pascalCase)(str));
};
exports.fileNamePascalCase = fileNamePascalCase;
const firstLetterToUppercase = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
};
exports.firstLetterToUppercase = firstLetterToUppercase;
const isNumeric = (str) => {
    if (typeof str !== "string") {
        return false;
    }
    return !isNaN(parseFloat(str));
};
exports.isNumeric = isNumeric;
//# sourceMappingURL=str.js.map