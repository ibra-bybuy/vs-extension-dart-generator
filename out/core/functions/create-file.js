"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceJsonExtension = exports.getFolder = exports.getFileName = void 0;
const getFileName = (path) => {
    const folder = path.split("/");
    return folder[folder.length - 1];
};
exports.getFileName = getFileName;
const getFolder = (path) => {
    const filename = (0, exports.getFileName)(path);
    return path.replace(filename, "");
};
exports.getFolder = getFolder;
const replaceJsonExtension = (path, ext) => {
    const folder = (0, exports.getFolder)(path);
    const filename = (0, exports.getFileName)(path).replace(".json", ext);
    return folder + filename;
};
exports.replaceJsonExtension = replaceJsonExtension;
//# sourceMappingURL=create-file.js.map