// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {
	COMMAND_API_KEY,
	COMMAND_DEVELOPER_ID,
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
import { Options } from './options';
import { Controlla } from './controlla';

var logger = new Logger(LogLevel.INFO);
var controlla: Controlla;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var options = new Options();

	controlla = new Controlla(context.extensionPath, logger, options);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "controlla" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json	
	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_API_KEY, () => {
			// The code you place here will be executed every time your command is executed
			// controlla.promptForApiKey();
			// Display a message box to the user
			controlla.promptForApiKey();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_DEVELOPER_ID, () => {
			controlla.promptForDeveloperId();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_PROXY, () => {
			controlla.promptForProxy();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_DEBUG, () => {
			controlla.promptForDebug();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_STATUS_BAR_ENABLED, () => {
			controlla.promptStatusBarIcon();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_STATUS_BAR_CODING_ACTIVITY, () => {
			controlla.promptStatusBarCodingActivity();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_DASHBOARD, () => {
			controlla.openDashboardWebsite();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_CONFIG_FILE, () => {
			controlla.openConfigFile();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_LOG_FILE, () => {
			controlla.openLogFile();
		}),
	);

	context.subscriptions.push(controlla);

	options.getSetting('settings', 'debug', function (_error, debug) {
		if (debug === 'true') {
			logger.setLevel(LogLevel.DEBUG);
			logger.debug('::Controlla debug mode::');
		}
		options.getSetting('settings', 'standalone', (_err, standalone) => {
			controlla.initialize(standalone !== 'false');
		});
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	controlla.dispose();
	logger.info('Controlla has been disabled!');
}
