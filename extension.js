const vscode = require('vscode');
const util = require('util');
const path = require('path');
const childprocess = require('child_process');

const EXTENSION_NAME = 'hg-utils';
const win = vscode.window;

let statusBarItem = null;

function activeTextEditorCallback(event) {
  statusBarItem.hide();

  let documentPath = path.dirname(event.document.uri.fsPath);
  let oldWorkingDir = process.cwd();

  try {
    process.chdir(documentPath);

    childprocess.exec('hg branch', (error, stdout, stderr) => {
      if (!error) {
        statusBarItem.text = util.format('Branch: %s', stdout);
        statusBarItem.show();
      } else {
        printError(`hg branch: ${stderr}`);
      }
    });

    process.chdir(oldWorkingDir);
  }
  catch (e) {
    printError(`activeTextEditorCallback: ${e.message}`);
  }
}

function printLog(msg) {
  console.log(`[${EXTENSION_NAME}] ${msg}`);
}

function printError(msg) {
  console.error(`[${EXTENSION_NAME}] ${msg}`);
}

function main() {
  printLog('Extension activated!');

  statusBarItem = win.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);

  win.onDidChangeActiveTextEditor(
    event => event && activeTextEditorCallback(event)
  );
}

function activate(context) {
  context.subscriptions.push(main());
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
