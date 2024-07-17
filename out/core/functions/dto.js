"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToDartDto = void 0;
const dart_1 = require("./dart");
const json_1 = require("./json");
const str_1 = require("./str");
const jsonToDartDto = (data, filename) => {
    const filenamCC = (0, str_1.fileNamePascalCase)(filename);
    const structuredJson = (0, json_1.structureJson)(data);
    const entitiesFilename = `${filenamCC}Dto`;
    return `
  import 'package:json_annotation/json_annotation.dart';

  part '${filename}_dto.g.dart';
  ${formDto(structuredJson, entitiesFilename)}
  `;
};
exports.jsonToDartDto = jsonToDartDto;
const formDto = (structuredJson, filename) => {
    let str = `
      @JsonSerializable()
      class ${filename} {
        ${(0, dart_1.finalFields)(structuredJson, filename, (f) => {
        return `@JsonKey(name: '${f.key}')`;
    })}
        const ${filename}({
            ${(0, dart_1.constructorFields)(structuredJson, filename)}
        });

        factory ${filename}.fromJson(Map<String, dynamic> json) =>
        _$${filename}FromJson(json);
  
        Map<String, dynamic> toJson() => _$${filename}ToJson(this);

        ${(0, dart_1.getCopyWith)(structuredJson, filename)}
      }
      `;
    for (const field of structuredJson) {
        if (field.valueObject.length > 0) {
            const fieldFilename = (0, dart_1.formDataObjectName)(field.name, filename);
            str += formDto(field.valueObject, fieldFilename);
        }
    }
    return str;
};
//# sourceMappingURL=dto.js.map