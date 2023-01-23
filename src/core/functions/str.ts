import { camelCase } from "lodash";

export const pascalCase = (str: string): string => camelCase(`${str}`);

export const fileNamePascalCase = (str: string): string => {
  return firstLetterToUppercase(pascalCase(str));
};

export const firstLetterToUppercase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

export const isNumeric = (str: string): boolean => {
  if (typeof str !== "string") {
    return false;
  }
  return !isNaN(parseFloat(str));
};
