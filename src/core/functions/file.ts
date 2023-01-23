import { readFile as rf, writeFile } from "fs/promises";

export const getFileName = (path: string): string => {
  const folder = path.split("/");

  return folder[folder.length - 1];
};

export const replaceFilenameExt = (
  path: string,
  replacement: string = ""
): string => {
  return getFileName(path).replace(".json", replacement);
};

export const getFolder = (path: string): string => {
  const filename = getFileName(path);
  return path.replace(filename, "");
};

export const replaceJsonExtension = (path: string, ext: string): string => {
  const folder = getFolder(path);
  const filename = replaceFilenameExt(ext);

  return folder + filename;
};

export const readFile = async (path: string): Promise<string | undefined> => {
  try {
    const data = await rf(path, { encoding: "utf8" });
    return data;
  } catch (err) {
    return undefined;
  }
};

export const saveFile = async (path: string, data: string) => {
  await writeFile(path, data);
};
