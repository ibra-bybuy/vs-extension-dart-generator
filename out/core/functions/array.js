"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayNumber = void 0;
const isArrayNumber = (value) => {
    if (Array.isArray(value) && value.length > 0) {
        return typeof value[0] === "number";
    }
    return false;
};
exports.isArrayNumber = isArrayNumber;
//# sourceMappingURL=array.js.map