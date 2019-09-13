const vscode = require('vscode');
const fs = require('fs');
const firstline = require('firstline');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('extension.open', function () {
    const filePath = getFilePath();

    if (!filePath) {
      return vscode.window.showErrorMessage("Open a folder in your workspace first or set DailyNotes.FilePath in Config");
    }

    if (fs.existsSync(filePath)) {
      prependDateHeader(filePath);
    } else {
      createNewNote(filePath);
    }

    vscode.workspace.openTextDocument(filePath).then(doc => {
      vscode.window.showTextDocument(doc, { preview: true });
    });
  });

  function getFilePath() {
    const configFilePath = vscode.workspace.getConfiguration().get('dailyNotes.filePath');
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (configFilePath) {
      return configFilePath;
    } else if (workspaceFolders && workspaceFolders.length > 0) {
      return workspaceFolders[0].uri.fsPath + "/daily-notes.md";
    } else {
      return null;
    }
  }

  function dateHeader() {
    const today = new Date();
    return "## " + today.toDateString() + "\r\n\r\n\r\n";
  }

  function prependDateHeader(filePath) {
    firstline(filePath).then((lastDateHeader) => {
      if (lastDateHeader.trim() != dateHeader().trim()) {
        prependFile(filePath, dateHeader(), (error) => {
          if (error) {
            console.error(error);
            return vscode.window.showErrorMessage("Cannot edit daily notes file.");
          }
        });
      }
    });
  }

  function prependFile(filePath, content, callback) {
    fs.readFile(filePath, 'utf8', function(error, result) {
      if (error && error.code !== 'ENOENT') {
        callback(error);
      } else {
        if (result) {
          content = content + '\n' + result;
        }

        fs.writeFile(filePath, content, callback);
      }
    });
  }

  function createNewNote(filePath) {
    fs.writeFile(filePath, dateHeader(), (error) => {
      if (error) {
        console.error(error);
        return vscode.window.showErrorMessage("Please set correct Daily Notes File Path in Config.");
      }
    });
  }

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
