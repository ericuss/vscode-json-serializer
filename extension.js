// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const ncp = require("copy-paste");
// const clipboardy = require('clipboardy');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "serializer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let serializeJsonToClipboardCommand = vscode.commands.registerCommand('serializer.serializeJsonToClipboard', function () {
		vscode.window.showInformationMessage('The serialize and copy to clipboard process is executing');
		let jsonActiveDocument = vscode.window.activeTextEditor.document.getText();
		let stringifiedActiveDocument = JSON.stringify(jsonActiveDocument);

		ncp.copy(stringifiedActiveDocument, function () {
			// complete...
			vscode.window.showInformationMessage('Copied to clipboard');
		})
	})
	context.subscriptions.push(serializeJsonToClipboardCommand);

	let serializeJsonToFileCommand = vscode.commands.registerCommand('serializer.serializeJsonToFile', function () {
		vscode.window.showInformationMessage('The serialize and copy to file process is executing');
		let jsonActiveDocument = vscode.window.activeTextEditor.document.getText();
		let stringifiedActiveDocument = JSON.stringify(jsonActiveDocument);
		let fileName = vscode.window.activeTextEditor.document.fileName;

		if (fileName.indexOf('.json') > -1) {
			fileName = fileName.replace('.json', '-serialized.txt');
			let fs = require('fs');
			fs.writeFile(fileName, stringifiedActiveDocument, function (err) {
				if (err) return console.log(err);
				vscode.window.showInformationMessage('Serialized into ' + fileName);
			});
		} else {
			vscode.window.showErrorMessage('The extension of the file is not Json');
		}
	})
	context.subscriptions.push(serializeJsonToFileCommand);

	// let serializerCommand = vscode.commands.registerCommand('serializer.serializer', function () {
	// 	// The code you place here will be executed every time your command is executed
	// 	console.log('Hello World from serializer!');

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from serializer!');
	// });
	// context.subscriptions.push(serializerCommand);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
