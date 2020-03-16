// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {
	COMMAND_API_KEY,
	COMMAND_PROXY,
	COMMAND_DEBUG,
	COMMAND_STATUS_BAR_ENABLED,
	COMMAND_STATUS_BAR_CODING_ACTIVITY,
	COMMAND_DASHBOARD,
	COMMAND_CONFIG_FILE,
	COMMAND_LOG_FILE,
	LogLevel,
} from './constants';
import { Logger } from './logger';

var logger = new Logger(LogLevel.INFO);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "controlla" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json	
	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_API_KEY, () => {
			// The code you place here will be executed every time your command is executed
			// wakatime.promptForApiKey();
			// Display a message box to the user
			vscode.window.showInformationMessage(COMMAND_API_KEY);
		}),
	);
}

// this method is called when your extension is deactivated
export function deactivate() {
	logger.info('Controlla has been disabled!');
}
