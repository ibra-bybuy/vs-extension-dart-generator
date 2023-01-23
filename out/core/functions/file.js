"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = exports.readFile = exports.replaceJsonExtension = exports.getFolder = exports.replaceFilenameExt = exports.getFileName = void 0;
const promises_1 = require("fs/promises");
const getFileName = (path) => {
    const folder = path.split("/");
    return folder[folder.length - 1];
};
exports.getFileName = getFileName;
const replaceFilenameExt = (path, replacement = "") => {
    return (0, exports.getFileName)(path).replace(".json", replacement);
};
exports.replaceFilenameExt = replaceFilenameExt;
const getFolder = (path) => {
    const filename = (0, exports.getFileName)(path);
    return path.replace(filename, "");
};
exports.getFolder = getFolder;
const replaceJsonExtension = (path, ext) => {
    const folder = (0, exports.getFolder)(path);
    const filename = (0, exports.replaceFilenameExt)(ext);
    return folder + filename;
};
exports.replaceJsonExtension = replaceJsonExtension;
const readFile = async (path) => {
    try {
        const data = await (0, promises_1.readFile)(path, { encoding: "utf8" });
        return data;
    }
    catch (err) {
        return undefined;
    }
};
exports.readFile = readFile;
const saveFile = async (path, data) => {
    await (0, promises_1.writeFile)(path, data);
};
exports.saveFile = saveFile;
//# sourceMappingURL=file.js.map