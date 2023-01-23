import { isNumeric } from "./str";

export type JsonField = {
  key: string;
  isArray: boolean;
  value: "string" | "int" | "double" | "bool" | "object" | "undefined";
  valueObject: JsonField[];
};

export const toJson = (data: string): any => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return undefined;
  }
};

export const structureJson = (
  data: any,
  previousName?: string
): JsonField[] => {
  const jsonFields: JsonField[] = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      let keyName = key;
      const value = data[key];
      const fieldType = getFieldType(value);
      let subFields: JsonField[] = [];
      let isArray = false;

      if (Array.isArray(value)) {
        isArray = true;
      }

      if (isNumeric(keyName)) {
        keyName = previousName ??= keyName;
      }

      if (fieldType === "object") {
        if (isArray) {
          const getFields = structureJson(value, keyName);
          if (getFields.length > 0) {
            subFields = getFields[0].valueObject;
          }
        } else {
          subFields = structureJson(value, keyName);
        }
      }

      jsonFields.push({
        key: keyName,
        isArray: isArray,
        value: fieldType,
        valueObject: subFields,
      });
    }
  }

  return jsonFields;
};

export const getFieldType = (
  value: any
): "string" | "int" | "double" | "bool" | "object" | "undefined" => {
  let valueType = typeof value;

  if (Array.isArray(value) && value.length > 0) {
    valueType = typeof value[0];
    value = value[0];
  }

  if (valueType === "string") {
    return "string";
  } else if (valueType === "number") {
    const str = value + "";
    if (str.includes(".") || str.includes(",")) {
      return "double";
    }
    return "int";
  } else if (valueType === "boolean") {
    return "bool";
  } else if (valueType === "object") {
    return "object";
  }

  return "undefined";
};
