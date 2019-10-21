// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Section, initConditionalSettings, ConditionalConfig, configs } from './lib/parseConditionalSettings';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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
