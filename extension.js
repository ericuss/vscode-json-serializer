// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const ncp = require("copy-paste");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "serializer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let serializeInitializeCommand = vscode.commands.registerCommand('serializer.serializeInitialize', async function () {
		vscode.window.showInformationMessage('The serialize is active');
	})
	context.subscriptions.push(serializeInitializeCommand);

	let serializeJsonToClipboardCommand = vscode.commands.registerCommand('serializer.serializeJsonToClipboard', async function () {
		vscode.window.showInformationMessage('The serialize and copy to clipboard process is executing');
		let textSerialized = getTextSeriarized();

		await copyToClipboard(textSerialized);
	})
	context.subscriptions.push(serializeJsonToClipboardCommand);

	let serializeJsonToFileCommand = vscode.commands.registerCommand('serializer.serializeJsonToFile', function () {
		vscode.window.showInformationMessage('The serialize and copy to file process is executing');
		let textSerialized = getTextSeriarized();
		let fileName = vscode.window.activeTextEditor.document.fileName;

		writeToFile(fileName, '-serialized.txt', textSerialized);
	})
	context.subscriptions.push(serializeJsonToFileCommand);

	let serializeSelectedJsonToClipboardCommand = vscode.commands.registerCommand('serializer.serializeSelectedJsonToClipboard', async function () {
		vscode.window.showInformationMessage('The serialize and copy to clipboard process is executing');
		let textSerialized = getSelectedTextSerialized();

		await copyToClipboard(textSerialized);
	})
	context.subscriptions.push(serializeSelectedJsonToClipboardCommand);

	let serializeSelectedJsonToFileCommand = vscode.commands.registerCommand('serializer.serializeSelectedJsonToFile', function () {
		vscode.window.showInformationMessage('The serialize and copy to file process is executing');
		let textSerialized = getSelectedTextSerialized();
		let fileName = vscode.window.activeTextEditor.document.fileName;

		writeToFile(fileName, '-serializedSelectedText.txt', textSerialized);
	})
	context.subscriptions.push(serializeSelectedJsonToFileCommand);

	let serializeSelectedJsonAndReplaceCommand = vscode.commands.registerCommand('serializer.serializeSelectedJsonAndReplace', async function () {
		vscode.window.showInformationMessage('The serialize and copy to clipboard process is executing');
		let textSerialized = getSelectedTextSerialized();

		const selections = vscode.window.activeTextEditor.selections;

		await vscode.window.activeTextEditor.edit(builder => {
			for (const selection of selections) {
				builder.replace(selection, textSerialized);
			}
		});
	})
	context.subscriptions.push(serializeSelectedJsonAndReplaceCommand);

	function copyToClipboard(textSerialized) {
		return new Promise((resolve, reject) => {
			ncp.copy(textSerialized, function () {
				vscode.window.showInformationMessage('Copied to clipboard');
				return resolve();
			});
		})
	}

	function getSelectedTextSerialized() {
		let selection = vscode.window.activeTextEditor.selection;
		let selectedText = vscode.window.activeTextEditor.document.getText(selection);
		let stringifiedActiveDocument = JSON.stringify(JSON.parse(selectedText));
		return stringifiedActiveDocument;
	}

	function getTextSeriarized() {
		let jsonActiveDocument = vscode.window.activeTextEditor.document.getText();
		let stringifiedActiveDocument = JSON.stringify(JSON.parse(jsonActiveDocument));
		return stringifiedActiveDocument;
	}

	function writeToFile(fileName, fileNameSufix, text) {
		if (fileName.indexOf('.json') > -1) {
			fileName = fileName.replace('.json', fileNameSufix);
			let fs = require('fs');
			fs.writeFile(fileName, text, function (err) {
				if (err)
					return console.log(err);
				vscode.window.showInformationMessage('Serialized into ' + fileName);
			});
		}
		else {
			vscode.window.showErrorMessage('The extension of the file is not Json');
		}
	}

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
