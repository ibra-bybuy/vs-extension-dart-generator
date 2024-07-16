import * as vscode from "vscode";
import {
  getFileName,
  getFolder,
  readFile,
  replaceFilenameExt,
  replaceJsonExtension,
  saveFile,
} from "./core/functions/file";
import { toJson } from "./core/functions/json";
import { jsonToDartEntity } from "./core/functions/entity";
import { exec } from "child_process";
import { jsonToDartDto } from "./core/functions/dto";

export interface File {
  path: string;
  scheme: string;
}

export function activate(context: vscode.ExtensionContext) {
  const wsedit = new vscode.WorkspaceEdit();
  const wsPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
  /**
   * GENERATING ENTITY
   */
  let disposableEntity = vscode.commands.registerCommand(
    "dart-dto---entities-generator.generateEntity",
    async (data: File) => {
      const path = data.path;
      const jsonData = await getJson(path);
      if (typeof jsonData === "string") {
        vscode.window.showErrorMessage(jsonData);
        return;
      }

      const filename = replaceFilenameExt(path);
      const dartBody = jsonToDartEntity(jsonData, filename);
      const dartFile = replaceJsonExtension(path, `${filename}_entity.dart`);

      await saveFile(dartFile, dartBody);
      exec(`dart format ${dartFile}`);

      vscode.window.showInformationMessage("Entity generated");
    }
  );

  /**
   * GENERATING DTO
   */
  let disposableDto = vscode.commands.registerCommand(
    "dart-dto---entities-generator.generateDto",
    async (data: File) => {
      var path = data.path;
      if (path.includes(":/")) {
        path = path.substring(1);
      }

      const jsonData = await getJson(path);


      if (typeof jsonData === "string") {
        vscode.window.showErrorMessage(jsonData);
        return;
      }

      const filename = replaceFilenameExt(path);
      const dartBody = jsonToDartDto(jsonData, filename);
      const dartFile = replaceJsonExtension(path, `${filename}_dto.dart`);

      await saveFile(dartFile, dartBody);
      exec(`dart format ${dartFile}`);

      const folder = getFolder(path);
      exec(
        `cd ${folder} && flutter pub run build_runner build --delete-conflicting-outputs`
      );

      vscode.window.showInformationMessage("DTO generated");
    }
  );

  context.subscriptions.push(disposableEntity);
  context.subscriptions.push(disposableDto);
}

const getJson = async (path: string): Promise<any> => {
  const fileData = await readFile(path);


  if (!fileData) {
    return "File does not contain data";
  }
  const jsonData = toJson(fileData);
  if (!jsonData) {
    return "Incorrect json data";
  }
  return jsonData;
};

// This method is called when your extension is deactivated
export function deactivate() { }
