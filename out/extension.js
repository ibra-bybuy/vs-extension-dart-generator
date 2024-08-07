"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const file_1 = require("./core/functions/file");
const json_1 = require("./core/functions/json");
const entity_1 = require("./core/functions/entity");
const child_process_1 = require("child_process");
const dto_1 = require("./core/functions/dto");
function activate(context) {
    const wsedit = new vscode.WorkspaceEdit();
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    /**
     * GENERATING ENTITY
     */
    let disposableEntity = vscode.commands.registerCommand("dart-dto-generator-entity.generateEntity", async (data) => {
        var path = data.path;
        if (path.includes(":/")) {
            path = path.substring(1);
        }
        const jsonData = await getJson(path);
        if (typeof jsonData === "string") {
            vscode.window.showErrorMessage(jsonData);
            return;
        }
        const filename = (0, file_1.replaceFilenameExt)(path);
        const dartBody = (0, entity_1.jsonToDartEntity)(jsonData, filename);
        const dartFile = (0, file_1.replaceJsonExtension)(path, `${filename}_entity.dart`);
        await (0, file_1.saveFile)(dartFile, dartBody);
        (0, child_process_1.exec)(`dart format ${dartFile}`);
        vscode.window.showInformationMessage("Entity generated");
    });
    /**
     * GENERATING DTO
     */
    let disposableDto = vscode.commands.registerCommand("dart-dto-generator-entity.generateDto", async (data) => {
        var path = data.path;
        if (path.includes(":/")) {
            path = path.substring(1);
        }
        const jsonData = await getJson(path);
        if (typeof jsonData === "string") {
            vscode.window.showErrorMessage(jsonData);
            return;
        }
        const filename = (0, file_1.replaceFilenameExt)(path);
        const dartBody = (0, dto_1.jsonToDartDto)(jsonData, filename);
        const dartFile = (0, file_1.replaceJsonExtension)(path, `${filename}_dto.dart`);
        await (0, file_1.saveFile)(dartFile, dartBody);
        (0, child_process_1.exec)(`dart format ${dartFile}`);
        const folder = (0, file_1.getFolder)(path);
        (0, child_process_1.exec)(`cd ${folder} && flutter pub run build_runner build --delete-conflicting-outputs`);
        vscode.window.showInformationMessage("DTO generated");
    });
    /**
    * GENERATING DTO
    */
    let disposableGettersAndSetters = vscode.commands.registerCommand('dart-dto-generator-entity.generateGetterAndSetter', () => {
        var editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        let arr = [];
        const selection = editor.selection;
        var text = editor.document.getText(selection);
        if (text.length < 1) {
            vscode.window.showErrorMessage('No selected properties.');
            return;
        }
        let properties = text.split(/\r?\n/).filter(x => x.length > 2).map(x => x.replace(';', ''));
        let generatedMethods = [];
        for (let p of properties) {
            try {
                generatedMethods = (0, entity_1.generateGetterAndSetter)(p, vscode.window.activeTextEditor?.document.getText() ?? "", arr);
            }
            catch (e) {
                vscode.window.showErrorMessage(`${e}`);
            }
        }
        editor.edit(edit => editor?.selections.forEach(selection => {
            edit.insert(selection.end, generatedMethods.join("\n"));
            arr = [];
        }));
    });
    context.subscriptions.push(disposableEntity);
    context.subscriptions.push(disposableDto);
    context.subscriptions.push(disposableGettersAndSetters);
}
exports.activate = activate;
const getJson = async (path) => {
    const fileData = await (0, file_1.readFile)(path);
    if (!fileData) {
        return "File does not contain data";
    }
    const jsonData = (0, json_1.toJson)(fileData);
    if (!jsonData) {
        return "Incorrect json data";
    }
    return jsonData;
};
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map