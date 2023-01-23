import {
  constructorFields,
  finalFields,
  formDataObjectName,
  getCopyWith,
  getType,
} from "./dart";
import { JsonField, structureJson } from "./json";
import { fileNamePascalCase, firstLetterToUppercase, pascalCase } from "./str";

export const jsonToDartEntity = (data: any, filename: string): string => {
  const filenamCC = fileNamePascalCase(filename);
  const structuredJson = structureJson(data);
  const entitiesFilename = `${filenamCC}Entities`;
  return `
  import 'package:equatable/equatable.dart';
  ${formEntities(structuredJson, entitiesFilename)}
  `;
};

const formEntities = (
  structuredJson: JsonField[],
  filename: string
): string => {
  let str = `
      class ${filename} extends Equatable {
        ${finalFields(structuredJson, filename)}
        const ${filename}({
            ${constructorFields(structuredJson, filename)}
        });

        ${getCopyWith(structuredJson, filename)}

        @override
        bool get stringify => true;

        @override
        List<Object> get props => [${getFieldKeys(structuredJson).join(",")}];
      }
      `;

  for (const field of structuredJson) {
    if (field.valueObject.length > 0) {
      const fieldFilename = formDataObjectName(field.key, filename);
      const getFirstField = field.valueObject[0];

      if (getFirstField.value === "object") {
        str += formEntities(getFirstField.valueObject, fieldFilename);
      } else {
        str += formEntities(field.valueObject, fieldFilename);
      }
    }
  }

  return str;
};

export const getFieldKeys = (fields: JsonField[]): string[] => {
  return fields.map((e) => pascalCase(e.key));
};
