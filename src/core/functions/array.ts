export const isArrayNumber = (value: any) => {
  if (Array.isArray(value) && value.length > 0) {
    return typeof value[0] === "number";
  }

  return false;
};
