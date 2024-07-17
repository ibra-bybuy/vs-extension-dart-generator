import { isNumeric, firstLetterToUppercase } from "./str";

export type JsonField = {
  key: string;
  name: string;
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
      if (fieldType == "undefined") {
        continue;
      }

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

      const nameLetters: string[] = [];

      for (let i = 0; i < keyName.length; i++) {
        const currentLetter = keyName[i]
        if (currentLetter == "_") {
          if (i != (keyName.length - 1)) {
            nameLetters.push(firstLetterToUppercase(keyName[i + 1]))
          }
          i++;
          continue;
        }

        nameLetters.push(currentLetter)
      }

      jsonFields.push({
        key: keyName,
        name: nameLetters.join(""),
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
  } else if (valueType === "object" && value != null) {
    return "object";
  }


  return "undefined";
};
