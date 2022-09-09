import * as fs from 'fs';
import * as os from 'os';

export class Dependencies {

    constructor() {}

    public checkAndInstall(callback: () => void): void {
      callback();
    }

    public static getHomeDirectory(): string {
        let home = process.env.CONTROLLA_HOME;
        if (home && home.trim() && fs.existsSync(home.trim())) {return home.trim();}
        if (Dependencies.isPortable()) {return process.env['VSCODE_PORTABLE'] as string;}
        return process.env[Dependencies.isWindows() ? 'USERPROFILE' : 'HOME'] || '';
    }

    public static isWindows(): boolean {
        return os.platform() === 'win32';
    }

    public static isPortable(): boolean {
        return !!process.env['VSCODE_PORTABLE'];
    }
    
}