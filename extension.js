const vscode = require("vscode");
const fs = require("fs");
const firstline = require("firstline");
const moment = require("moment");
const homedir = require("os").homedir();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.open",
    function () {
      const filePath = getFilePath();

      setSyntaxHighlight(context.extensionPath);

      if (fs.existsSync(filePath)) {
        prependDateHeader(filePath);
      } else {
        createNewNote(filePath);
      }

      vscode.workspace.openTextDocument(filePath).then(doc => {
        vscode.window.showTextDocument(doc);
      });
    }
  );

  function setSyntaxHighlight(extensionPath) {
    const currentConfig = vscode.workspace.getConfiguration(
      "editor.tokenColorCustomizations"
    );

    if (currentConfig.has("textMateRules")) return;

    fs.readFile(
      extensionPath + "/syntaxes/custom-colors.json",
      "utf8",
      function (error, colors) {
        let mutableConfig = JSON.parse(JSON.stringify(currentConfig));

        mutableConfig.textMateRules = JSON.parse(colors.toString());

        vscode.workspace
          .getConfiguration("editor")
          .update(
            "tokenColorCustomizations",
            mutableConfig,
            vscode.ConfigurationTarget.Global
          );
      }
    );
  }

  function getFilePath() {
    const configFilePath = vscode.workspace
      .getConfiguration()
      .get("dailyNotes.filePath");

    if (configFilePath) {
      return configFilePath;
    } else {
      return homedir + "/daily-notes.md";
    }
  }

  function dateHeader() {
    const today = new Date();
    const configDateFormat = vscode.workspace
      .getConfiguration()
      .get("dailyNotes.dateFormat");

    if (configDateFormat) {
      return "## " + moment(today).format(configDateFormat) + "\r\n\r\n\r\n";
    } else {
      return "## " + today.toDateString() + "\r\n\r\n\r\n";
    }
  }

  function prependDateHeader(filePath) {
    firstline(filePath).then(lastDateHeader => {
      if (lastDateHeader.trim() != dateHeader().trim()) {
        prependFile(filePath, dateHeader(), error => {
          if (error) {
            console.error(error);
            return vscode.window.showErrorMessage(
              "Cannot edit Daily Notes File."
            );
          }
        });
      }
    });
  }

  function prependFile(filePath, content, callback) {
    fs.readFile(filePath, "utf8", function (error, result) {
      if (error && error.code !== "ENOENT") {
        callback(error);
      } else {
        if (result) {
          content = content + "\n" + result;
        }

        fs.writeFile(filePath, content, callback);
      }
    });
  }

  function createNewNote(filePath) {
    fs.writeFile(filePath, dateHeader(), error => {
      if (error) {
        console.error(error);
        return vscode.window.showErrorMessage(
          "Please set correct Daily Notes File Path in Config."
        );
      }
    });
  }

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
