"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCopyValueFields = exports.getNullableFields = exports.getCopyWith = exports.getFieldKeys = exports.formDataObjectName = exports.jsonToDartEntity = void 0;
const json_1 = require("./json");
const str_1 = require("./str");
const jsonToDartEntity = (data, filename) => {
    const filenamCC = (0, str_1.fileNamePascalCase)(filename);
    const structuredJson = (0, json_1.structureJson)(data);
    const entitiesFilename = `${filenamCC}Entities`;
    return `
  import 'package:equatable/equatable.dart';
  ${formEntities(structuredJson, entitiesFilename)}
  `;
};
exports.jsonToDartEntity = jsonToDartEntity;
const formEntities = (structuredJson, filename) => {
    let str = `
      class ${filename} extends Equatable {
        ${finalFields(structuredJson, filename)}
        const ${filename}({
            ${constructorFields(structuredJson, filename)}
        });

        ${(0, exports.getCopyWith)(structuredJson, filename)}

        @override
        bool get stringify => true;

        @override
        List<Object> get props => [${(0, exports.getFieldKeys)(structuredJson).join(",")}];
      }
      `;
    for (const field of structuredJson) {
        if (field.valueObject.length > 0) {
            const fieldFilename = (0, exports.formDataObjectName)(field.key, filename);
            const getFirstField = field.valueObject[0];
            if (getFirstField.value === "object") {
                str += formEntities(getFirstField.valueObject, fieldFilename);
            }
            else {
                str += formEntities(field.valueObject, fieldFilename);
            }
        }
    }
    return str;
};
const finalFields = (structuredJson, filename) => {
    const fields = [];
    for (const field of structuredJson) {
        let type = getType(field, filename);
        if (type.length > 0) {
            fields.push(`final ${type} ${(0, str_1.pascalCase)(field.key)};`);
        }
    }
    return fields.join("\n");
};
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
        type = (0, exports.formDataObjectName)(field.key, fileName);
    }
    if (field.isArray && type.length > 0) {
        type = `List<${type}>`;
    }
    return type;
};
const constructorFields = (structuredJson, fileName) => {
    const fields = [];
    for (const field of structuredJson) {
        let defaultValue = constructorDefaultValue(field, fileName);
        if (field.isArray) {
            defaultValue = `const []`;
        }
        fields.push(`this.${(0, str_1.pascalCase)(field.key)} = ${defaultValue}`);
    }
    const str = fields.join(",\n");
    return fields.length > 0 ? `${str},` : str;
};
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
        return `const ${(0, exports.formDataObjectName)(field.key, fileName)}()`;
    }
    return "";
};
const formDataObjectName = (keyName, filename) => {
    return filename + (0, str_1.firstLetterToUppercase)(keyName);
};
exports.formDataObjectName = formDataObjectName;
const getFieldKeys = (fields) => {
    return fields.map((e) => (0, str_1.pascalCase)(e.key));
};
exports.getFieldKeys = getFieldKeys;
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
        const type = getType(field, filename);
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
//# sourceMappingURL=entity%20copy.js.map