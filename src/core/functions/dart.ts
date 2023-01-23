import { JsonField } from "./json";
import { firstLetterToUppercase, pascalCase } from "./str";

export const getCopyWith = (fields: JsonField[], filename: string): string => {
  const nullableFields = getNullableFields(fields, filename);
  let nullableFieldsStr = `${nullableFields.join(",")}`;
  const copyValFields = getCopyValueFields(fields);
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

export const getNullableFields = (
  fields: JsonField[],
  filename: string
): string[] => {
  const newFields: string[] = [];

  for (const field of fields) {
    const type = getType(field, filename);
    if (type.length > 0) {
      newFields.push(`${type}? ${pascalCase(field.key)}`);
    }
  }

  return newFields;
};

export const getCopyValueFields = (fields: JsonField[]): string[] => {
  const newFields: string[] = [];

  for (const field of fields) {
    const fieldName = pascalCase(field.key);
    newFields.push(`${fieldName}: ${fieldName} ?? this.${fieldName}`);
  }

  return newFields;
};

export const getType = (field: JsonField, fileName: string): string => {
  let type = "";
  if (field.value === "int") {
    type = "int";
  } else if (field.value === "bool") {
    type = "bool";
  } else if (field.value === "double") {
    type = "num";
  } else if (field.value === "string") {
    type = "String";
  } else if (field.value === "object") {
    type = formDataObjectName(field.key, fileName);
  }

  if (field.isArray && type.length > 0) {
    type = `List<${type}>`;
  }

  return type;
};

export const formDataObjectName = (
  keyName: string,
  filename: string
): string => {
  return filename + firstLetterToUppercase(keyName);
};

export const finalFields = (
  structuredJson: JsonField[],
  filename: string,
  preText?: (field: JsonField) => string
): string => {
  const fields: string[] = [];
  for (const field of structuredJson) {
    let type = getType(field, filename);
    if (type.length > 0) {
      let str = preText ? preText(field) : "";
      str += `final ${type} ${pascalCase(field.key)};`;
      fields.push(str);
    }
  }

  return fields.join("\n");
};

export const constructorFields = (
  structuredJson: JsonField[],
  fileName: string
): string => {
  const fields: string[] = [];
  for (const field of structuredJson) {
    let defaultValue = constructorDefaultValue(field, fileName);

    if (field.isArray) {
      defaultValue = `const []`;
    }

    fields.push(`this.${pascalCase(field.key)} = ${defaultValue}`);
  }

  const str = fields.join(",\n");

  return fields.length > 0 ? `${str},` : str;
};

const constructorDefaultValue = (
  field: JsonField,
  fileName: string
): string => {
  if (field.value === "bool") {
    return "false";
  } else if (field.value === "double") {
    return "0.0";
  } else if (field.value === "int") {
    return "0";
  } else if (field.value === "string") {
    return '""';
  } else if (field.value === "object") {
    return `const ${formDataObjectName(field.key, fileName)}()`;
  }

  return "";
};
