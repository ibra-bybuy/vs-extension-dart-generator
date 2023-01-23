"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldKeys = exports.jsonToDartEntity = void 0;
const dart_1 = require("./dart");
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
const getFieldKeys = (fields) => {
    return fields.map((e) => (0, str_1.pascalCase)(e.key));
};
exports.getFieldKeys = getFieldKeys;
//# sourceMappingURL=entity.js.map