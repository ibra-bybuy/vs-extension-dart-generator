"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldType = exports.structureJson = exports.toJson = void 0;
const str_1 = require("./str");
const toJson = (data) => {
    try {
        return JSON.parse(data);
    }
    catch (e) {
        return undefined;
    }
};
exports.toJson = toJson;
const structureJson = (data, previousName) => {
    const jsonFields = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let keyName = key;
            const value = data[key];
            const fieldType = (0, exports.getFieldType)(value);
            if (fieldType == "undefined") {
                continue;
            }
            let subFields = [];
            let isArray = false;
            if (Array.isArray(value)) {
                isArray = true;
            }
            if ((0, str_1.isNumeric)(keyName)) {
                keyName = previousName ?? (previousName = keyName);
            }
            if (fieldType === "object") {
                if (isArray) {
                    const getFields = (0, exports.structureJson)(value, keyName);
                    if (getFields.length > 0) {
                        subFields = getFields[0].valueObject;
                    }
                }
                else {
                    subFields = (0, exports.structureJson)(value, keyName);
                }
            }
            const nameLetters = [];
            for (let i = 0; i < keyName.length; i++) {
                const currentLetter = keyName[i];
                if (currentLetter == "_") {
                    if (i != (keyName.length - 1)) {
                        nameLetters.push((0, str_1.firstLetterToUppercase)(keyName[i + 1]));
                    }
                    i++;
                    continue;
                }
                nameLetters.push(currentLetter);
            }
            jsonFields.push({
                key: keyName,
                name: nameLetters.join(""),
                isArray: isArray,
                value: fieldType,
                valueObject: subFields,
            });
        }
    }
    return jsonFields;
};
exports.structureJson = structureJson;
const getFieldType = (value) => {
    let valueType = typeof value;
    if (Array.isArray(value) && value.length > 0) {
        valueType = typeof value[0];
        value = value[0];
    }
    if (valueType === "string") {
        return "string";
    }
    else if (valueType === "number") {
        const str = value + "";
        if (str.includes(".") || str.includes(",")) {
            return "double";
        }
        return "int";
    }
    else if (valueType === "boolean") {
        return "bool";
    }
    else if (valueType === "object" && value != null) {
        return "object";
    }
    return "undefined";
};
exports.getFieldType = getFieldType;
//# sourceMappingURL=json.js.map