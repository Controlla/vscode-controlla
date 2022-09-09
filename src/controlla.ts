import * as vscode from 'vscode';
import { COMMAND_DASHBOARD } from './constants';
import { Dependencies } from "./dependencies";
import { Libs } from './libs';
import { Logger } from "./logger";
import { Options } from "./options";

export class Controlla {
    // private agentName: string | undefined;
    private extension!: { version: any; };
    private statusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
    );
    private disposable!: vscode.Disposable;
    // private extensionPath: string;
    private options: Options;
    private logger: Logger;
    private dependencies!: Dependencies;
    // private global: boolean | undefined;

    constructor(logger: Logger, options: Options) {
        // this.extensionPath = extensionPath;
        this.logger = logger;
        this.options = options;
    }

    public initialize(): void {
        // this.global = global;
        this.dependencies = new Dependencies();

        this.statusBar.command = COMMAND_DASHBOARD;

        let extension = vscode.extensions.getExtension('Controlla.vscode-controlla');
        this.extension = (extension !== undefined && extension.packageJSON) || { version: '0.0.0' };
        this.logger.debug(`Initializing Controlla v${this.extension.version}`);
        // this.agentName = 'vscode';
        this.statusBar.text = '$(sync~spin) Controlla Initializing...';
        this.statusBar.show();
        
        this.setupEventListeners();

        this.checkApiKey();

        // this.initializeDependencies();
    }

    public initializeDependencies(): void {
        this.dependencies.checkAndInstall(() => {
            this.logger.debug('Controlla: Initialized');
            this.statusBar.text = '$(rocket)';
            this.statusBar.tooltip = 'Controlla: Initialized';
        });
    }

    public promptForApiKey(): void {
        this.options.getSetting('settings', 'api_key', (_err, defaultVal) => {
            if (Libs.validateKey(defaultVal) !== '') { defaultVal = ''; }
            let promptOptions = {
                prompt: 'Controlla Api Key',
                placeHolder: 'Enter your api key from https://controlla.com.mx/settings',
                value: defaultVal,
                ignoreFocusOut: true,
                validateInput: Libs.validateKey.bind(this),
            };
            vscode.window.showInputBox(promptOptions).then((val: string | undefined) => {
                if (val !== undefined) {
                    let validation = Libs.validateKey(val);
                    if (validation === '') {
                        this.options.setSetting('settings', 'api_key', val);
                        // this.checkDeveloperId(); 
                    } else { 
                        vscode.window.setStatusBarMessage(validation);
                    }
                } else { vscode.window.setStatusBarMessage('Controlla api key not provided'); }
            });
        });
    }

    public openDashboardWebsite(): void {
        let url = 'https://controlla.com.mx/';
        vscode.env.openExternal(vscode.Uri.parse(url));
    }

    public newFeature(): void {
        
    }

    private checkApiKey(): void {
        this.hasApiKey(hasApiKey => {
          if (!hasApiKey) { 
            this.promptForApiKey();
          }
        });
      }

    private hasApiKey(callback: (arg0: boolean) => void): void {
        this.options
            .getApiKeyAsync()
            .then(apiKey => callback(Libs.validateKey(apiKey) === ''))
            .catch(err => {
                this.logger.error(`Error reading api key: ${err}`);
                callback(false);
            });
    }

    private setupEventListeners(): void {
        // subscribe to selection change and editor activation events
        let subscriptions: vscode.Disposable[] = [];
    
        // create a combined disposable from both event subscriptions
        this.disposable = vscode.Disposable.from(...subscriptions);
    }

    public dispose() {
        this.statusBar.dispose();
        this.disposable.dispose();
    }
}