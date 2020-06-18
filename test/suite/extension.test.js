const assert = require('assert');
const path = require('path');
const vscode = require('vscode');
const ncp = require("copy-paste");

const Extension = require('../../extension');
const testFolderLocation = '/../../test/test-environment/'
suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	const expected_json_serialized = '{"quiz":{"sport":{"q1":{"question":"Which one is correct team name in NBA?","options":["New York Bulls","Los Angeles Kings","Golden State Warriros","Huston Rocket"],"answer":"Huston Rocket"}},"maths":{"q1":{"question":"5 + 7 = ?","options":["10","11","12","13"],"answer":"12"},"q2":{"question":"12 - 8 = ?","options":["1","2","3","4"],"answer":"4"}}}}'
	const expected_selected_json_serialized = '{"q1":{"question":"Which one is correct team name in NBA?","options":["New York Bulls","Los Angeles Kings","Golden State Warriros","Huston Rocket"],"answer":"Huston Rocket"}}'

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});

	// the first call to extension cost a more than 1s
	test('Initialize extensions', async () => {
		await vscode.commands.executeCommand('serializer.serializeInitialize')
		assert.equal(true, true)
	})

	// from file
	test('Given a json file when call to serialize json to clipboard then the clipboard contains the serialized json', async () => {
		await openSampleFile()
		await vscode.commands.executeCommand('serializer.serializeJsonToClipboard')
		const text = getTextFromClipboard();

		assert.equal(text, expected_json_serialized);
	})

	test('Given a json file when call to serialize json to file then the file is generated and contains the serialized json', async () => {
		await openSampleFile()
		await vscode.commands.executeCommand('serializer.serializeJsonToFile')
		const text = await getTextFromGeneratedFile('test-serialized.txt');

		assert.equal(text, expected_json_serialized);
		deleteFile(path.join(__dirname + testFolderLocation + 'test-serialized.txt'));
	})

	// from selected text
	test('Given a selected text inside editor when call to serialize selected json to clipboard then the clipboard contains the serialized json', async () => {
		await openSampleFile()

		var selection = new vscode.Selection(2, 17, 13, 9);
		vscode.window.activeTextEditor.selection = selection;

		vscode.window.activeTextEditor.selections = [selection];

		await vscode.commands.executeCommand('serializer.serializeSelectedJsonToClipboard')
		const text = getTextFromClipboard();

		assert.equal(text, expected_selected_json_serialized);
	})

	test('Given a selected text inside editor when call to serialize selected json to file then the file contains the serialized json', async () => {
		await openSampleFile()

		var selection = new vscode.Selection(2, 17, 13, 9);
		vscode.window.activeTextEditor.selection = selection;

		vscode.window.activeTextEditor.selections = [selection];

		await vscode.commands.executeCommand('serializer.serializeSelectedJsonToFile')

		const text = await getTextFromGeneratedFile('test-serializedSelectedText.txt');
		assert.equal(text, expected_selected_json_serialized);
		await deleteFile(path.join(__dirname + testFolderLocation + 'test-serializedSelectedText.txt'));
	})

	test('Given a selected text inside editor when call to serialize selected json and replace then editor contains the serialized json replacing the old selected json', async () => {
		await openSampleFile()

		var selection = new vscode.Selection(2, 17, 13, 9);
		vscode.window.activeTextEditor.selection = selection;

		vscode.window.activeTextEditor.selections = [selection];

		await vscode.commands.executeCommand('serializer.serializeSelectedJsonAndReplace')
		let text = getSelectedTextSerialized()
		assert.equal(text, expected_selected_json_serialized);
	})

});

function getSelectedTextSerialized() {
	let selection = vscode.window.activeTextEditor.selection;
	let selectedText = vscode.window.activeTextEditor.document.getText(selection);
	let stringified = JSON.stringify(JSON.parse(selectedText));
	return stringified;
}

function getTextFromClipboard() {
	return ncp.paste()
}

async function getTextFromGeneratedFile(fileName) {
	const uriTxt = vscode.Uri.file(
		path.join(__dirname + testFolderLocation + fileName)
	);
	const txtDocument = await vscode.workspace.openTextDocument(uriTxt);
	await vscode.window.showTextDocument(txtDocument);
	const text = vscode.window.activeTextEditor.document.getText();
	return text;
}

async function deleteFile(fileName) {
	let fs = require('fs');
	await fs.unlink(fileName, () => { })
}

async function openSampleFile() {
	const uri = vscode.Uri.file(
		path.join(__dirname + testFolderLocation + 'test.json')
	)
	const jsonDocument = await vscode.workspace.openTextDocument(uri)
	await vscode.window.showTextDocument(jsonDocument)
}
