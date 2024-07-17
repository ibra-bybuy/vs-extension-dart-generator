"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGetterAndSetter = exports.getFieldKeys = exports.jsonToDartEntity = void 0;
const dart_1 = require("./dart");
const json_1 = require("./json");
const str_1 = require("./str");
const jsonToDartEntity = (data, filename) => {
    const filenamCC = (0, str_1.fileNamePascalCase)(filename);
    const structuredJson = (0, json_1.structureJson)(data);
    const entitiesFilename = `${filenamCC}Entities`;
    console.log(structuredJson);
    return `
  import 'package:equatable/equatable.dart';
  ${formEntities(structuredJson, entitiesFilename)}
  `;
};
exports.jsonToDartEntity = jsonToDartEntity;
const formEntities = (structuredJson, filename) => {
    let str = `
      class ${filename} extends Equatable {
        ${(0, dart_1.finalFields)(structuredJson, filename)}
        const ${filename}({
            ${(0, dart_1.constructorFields)(structuredJson, filename)}
        });

        ${(0, dart_1.getCopyWith)(structuredJson, filename)}

        @override
        bool get stringify => true;

        @override
        List<Object> get props => [${(0, exports.getFieldKeys)(structuredJson).join(",")}];
      }
      `;
    for (const field of structuredJson) {
        if (field.valueObject.length > 0) {
            const fieldFilename = (0, dart_1.formDataObjectName)(field.key, filename);
            str += formEntities(field.valueObject, fieldFilename);
        }
    }
    return str;
};
const getFieldKeys = (fields) => {
    return fields.map((e) => (0, str_1.pascalCase)(e.key));
};
exports.getFieldKeys = getFieldKeys;
function generateGetterAndSetter(prop, activatedText, arr) {
    let s;
    let setter;
    let type = prop.split(" ").splice(0)[0];
    if (prop.includes("=")) {
        prop = prop.substring(0, prop.lastIndexOf("=")).trim();
    }
    let variableName = prop.split(" ").slice(-1);
    let varUpprName = variableName.toString().charAt(0).toUpperCase() + variableName.toString().slice(1);
    if (prop.includes("_")) {
        let varNewName = (0, str_1.firstLetterToUppercase)(variableName.toString().slice(1));
        s = `\n ${type} get get${varNewName} => ${variableName};`;
        setter = `\n set set${varNewName}(${type} value) => ${variableName} = value;`;
    }
    else {
        s = `\n ${type} get get${varUpprName} => ${variableName};`;
        setter = `\n set set${varUpprName}(${type} ${variableName}) => ${variableName} = ${variableName};`;
    }
    if (activatedText.includes(`=> ${variableName}`)) {
        throw Error('Setter and Getter already created.');
    }
    arr.push(s, setter);
    let sets = new Set(arr);
    let it = sets.values();
    arr = Array.from(it);
    return arr;
}
exports.generateGetterAndSetter = generateGetterAndSetter;
//# sourceMappingURL=entity.js.map