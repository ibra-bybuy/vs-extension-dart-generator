import {
  constructorFields,
  finalFields,
  formDataObjectName,
  getCopyWith,
} from "./dart";
import { JsonField, structureJson } from "./json";
import { fileNamePascalCase } from "./str";

export const jsonToDartDto = (data: any, filename: string): string => {
  const filenamCC = fileNamePascalCase(filename);
  const structuredJson = structureJson(data);
  const entitiesFilename = `${filenamCC}Dto`;
  return `
  import 'package:json_annotation/json_annotation.dart';

  part '${filename}_dto.g.dart';
  ${formDto(structuredJson, entitiesFilename)}
  `;
};

const formDto = (structuredJson: JsonField[], filename: string): string => {
  let str = `
      @JsonSerializable()
      class ${filename} {
        ${finalFields(structuredJson, filename, (f) => {
    return `@JsonKey(name: '${f.key}')`;
  })}
        const ${filename}({
            ${constructorFields(structuredJson, filename)}
        });

        factory ${filename}.fromJson(Map<String, dynamic> json) =>
        _$${filename}FromJson(json);
  
        Map<String, dynamic> toJson() => _$${filename}ToJson(this);

        ${getCopyWith(structuredJson, filename)}
      }
      `;

  for (const field of structuredJson) {
    if (field.valueObject.length > 0) {
      const fieldFilename = formDataObjectName(field.name, filename);
      str += formDto(field.valueObject, fieldFilename);
    }
  }

  return str;
};