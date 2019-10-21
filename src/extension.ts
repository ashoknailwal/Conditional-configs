// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Section, initConditionalSettings, ConditionalConfig, configs } from './lib/parseConditionalSettings';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "conditional-settings" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	console.log("test conditional-settings");
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World!');
	// });

	// context.subscriptions.push(disposable);
	
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		
		if (e.affectsConfiguration(`${Section.conditionalConfig}.${configs.configs}`) || 
		e.affectsConfiguration(`${Section.conditionalConfig}.${configs.isDisabled}`)) {
			triggerConditionalSettings();
		}
	}));
	
	triggerConditionalSettings();
}

function triggerConditionalSettings() {
	if (vscode.workspace.workspaceFolders) {
		const isDisabled = vscode.workspace.getConfiguration(Section.conditionalConfig).get<boolean | undefined>(configs.isDisabled, false);
		const conditionalConfigs: ConditionalConfig[] | undefined =  vscode.workspace.getConfiguration(Section.conditionalConfig).get<ConditionalConfig[] | undefined>(configs.configs, []);
		if (!isDisabled) {
			initConditionalSettings(conditionalConfigs || []);
		}
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
