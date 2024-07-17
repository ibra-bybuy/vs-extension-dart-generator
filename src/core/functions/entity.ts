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
  console.log(structuredJson);
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
      str += formEntities(field.valueObject, fieldFilename);
    }
  }

  return str;
};

export const getFieldKeys = (fields: JsonField[]): string[] => {
  return fields.map((e) => pascalCase(e.key));
};

export function generateGetterAndSetter(prop: String, activatedText: String, arr: string[]): string[] {
  let s;
  let setter;

  let type = prop.split(" ").splice(0)[0];
  if (prop.includes("=")) {
    prop = prop.substring(0, prop.lastIndexOf("=")).trim()
  }
  let variableName = prop.split(" ").slice(-1);
  let varUpprName = variableName.toString().charAt(0).toUpperCase() + variableName.toString().slice(1);
  if (prop.includes("_")) {
    let varNewName = firstLetterToUppercase(variableName.toString().slice(1));
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