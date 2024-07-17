"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructorFields = exports.finalFields = exports.formDataObjectName = exports.getType = exports.getCopyValueFields = exports.getNullableFields = exports.getCopyWith = void 0;
const str_1 = require("./str");
const getCopyWith = (fields, filename) => {
    const nullableFields = (0, exports.getNullableFields)(fields, filename);
    let nullableFieldsStr = `${nullableFields.join(",")}`;
    const copyValFields = (0, exports.getCopyValueFields)(fields);
    let copyValFieldsStr = copyValFields.join(",");
    if (nullableFields.length > 0) {
        nullableFieldsStr += ",";
    }
    if (copyValFieldsStr.length > 0) {
        copyValFieldsStr += ",";
    }
    return `${filename} copyWith({
      ${nullableFieldsStr}
    }) {
      return ${filename}(
        ${copyValFieldsStr}
      );
    }`;
};
exports.getCopyWith = getCopyWith;
const getNullableFields = (fields, filename) => {
    const newFields = [];
    for (const field of fields) {
        const type = (0, exports.getType)(field, filename);
        if (type.length > 0) {
            newFields.push(`${type}? ${(0, str_1.pascalCase)(field.key)}`);
        }
    }
    return newFields;
};
exports.getNullableFields = getNullableFields;
const getCopyValueFields = (fields) => {
    const newFields = [];
    for (const field of fields) {
        const fieldName = (0, str_1.pascalCase)(field.key);
        newFields.push(`${fieldName}: ${fieldName} ?? this.${fieldName}`);
    }
    return newFields;
};
exports.getCopyValueFields = getCopyValueFields;
const getType = (field, fileName) => {
    let type = "";
    if (field.value === "int") {
        type = "int";
    }
    else if (field.value === "bool") {
        type = "bool";
    }
    else if (field.value === "double") {
        type = "num";
    }
    else if (field.value === "string") {
        type = "String";
    }
    else if (field.value === "object") {
        type = (0, exports.formDataObjectName)(field.name, fileName);
    }
    if (field.isArray && type.length > 0) {
        type = `List<${type}>`;
    }
    return type;
};
exports.getType = getType;
const formDataObjectName = (keyName, filename) => {
    return filename + (0, str_1.firstLetterToUppercase)(keyName);
};
exports.formDataObjectName = formDataObjectName;
const finalFields = (structuredJson, filename, preText) => {
    const fields = [];
    for (const field of structuredJson) {
        let type = (0, exports.getType)(field, filename);
        if (type.length > 0) {
            let str = preText ? preText(field) : "";
            str += `final ${type} ${(0, str_1.pascalCase)(field.key)};`;
            fields.push(str);
        }
    }
    return fields.join("\n");
};
exports.finalFields = finalFields;
const constructorFields = (structuredJson, fileName) => {
    const fields = [];
    for (const field of structuredJson) {
        let defaultValue = constructorDefaultValue(field, fileName);
        if (field.isArray) {
            defaultValue = `const []`;
        }
        fields.push(`this.${((0, str_1.pascalCase)(field.key))} = ${defaultValue}`);
    }
    const str = fields.join(",\n");
    return fields.length > 0 ? `${str},` : str;
};
exports.constructorFields = constructorFields;
const constructorDefaultValue = (field, fileName) => {
    if (field.value === "bool") {
        return "false";
    }
    else if (field.value === "double") {
        return "0.0";
    }
    else if (field.value === "int") {
        return "0";
    }
    else if (field.value === "string") {
        return '""';
    }
    else if (field.value === "object") {
        return `const ${(0, exports.formDataObjectName)(field.name, fileName)}()`;
    }
    return "";
};
//# sourceMappingURL=dart.js.map