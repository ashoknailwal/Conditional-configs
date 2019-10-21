/**
 * [
 *   {
 *      conditions: {
 *                      hasFile: "",
 *                      always: ""
 *                 },
 *      settingsToChange: {
 *                      
 *                },
 *      runShellCommand: []   // command and arguments to run similar to child_process.spawn
 *   }
 * ]
 */
import * as vscode from 'vscode';
import {spawn} from 'child_process';

export enum Section {
    conditionalConfig = 'conditionalConfig'
}

export interface Conditions {
    hasFile: string;
    always: boolean;
}

export interface SettingsToChange {
    [key: string]: any;
}

export type RunShellCommand = [string, string[] | undefined, any];

export interface ConditionalConfig {
    conditions: Conditions;
    settingsToChange: SettingsToChange;
    runShellCommand: RunShellCommand;
}

export enum configs {
    configs = 'configs',
    isDisabled = 'disable'
}

export const checkConditions = async (conditions: Conditions) => {
    const results = await vscode.workspace.findFiles(conditions.hasFile, '', 1);
    return conditions.always || (Array.isArray(results) && results.length > 0);
};

export const updateSettingsToChange = async (settingsToChange: SettingsToChange) => {
    const tasksList = [];
    for (const setting in settingsToChange) {
        if (settingsToChange.hasOwnProperty(setting)) {
            tasksList.push(vscode.workspace.getConfiguration().update(setting, settingsToChange[setting], vscode.ConfigurationTarget.Workspace));
        }
    }
    return await Promise.all(tasksList);
};

export const runShellScript = (run: RunShellCommand) => {
    const runCommand = spawn(run[0], run[1], {cwd: vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.path});
    runCommand.on('close', (code) => {
        if (code === 0) {
            vscode.window.showInformationMessage(`Successfully ran command: ${run}`);
        } else {
            vscode.window.showErrorMessage(`Command ${run} failed with exit code of: ${code}`);
        }
        console.log(`run-command from conditional-configs exited with code: ${code}`);
    });
};

export const initConditionalSettings = (conditionalConfigArray: ConditionalConfig[]) => {
    const tasksList = conditionalConfigArray.map(conditionalConfig => {
        const wrapper = async () => {
            const makeChanges = await checkConditions(conditionalConfig.conditions);
            if (makeChanges) {
                await updateSettingsToChange(conditionalConfig.settingsToChange);
                runShellScript(conditionalConfig.runShellCommand);
            }
        };
        return wrapper();
    });
    return Promise.all(tasksList);
};