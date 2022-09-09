// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { newFeature } from './commands';
import { COMMAND_DASHBOARD, COMMAND_NEW_FEATURE, LogLevel } from './constants';
import { Controlla } from './controlla';
import { Logger } from './logger';
import { Options } from "./options";

var logger = new Logger(LogLevel.INFO);
var controlla:Controlla;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var options = new Options();
	controlla = new Controlla(logger, options);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "controlla" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_DASHBOARD, () => {
			controlla.openDashboardWebsite();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_NEW_FEATURE, newFeature)
	);

	context.subscriptions.push(controlla);

	options.getSetting('settings', 'debug', function (_error, debug) {
		if (debug === 'true') {
			logger.setLevel(LogLevel.DEBUG);
			logger.debug('::Controlla debug mode::');
		}
		options.getSetting('settings', 'standalone', (_err) => {
			controlla.initialize();
		});
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	logger.info('Controlla has been disabled!');
}
