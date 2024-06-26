import { createRequire } from "module";

const require = createRequire(import.meta.url);


const { app, BrowserWindow, ipcMain } = require('electron');

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

var basepath = app.getAppPath();

//const {download,CancelError} = require("electron-dl");

import {download, CancelError} from 'electron-dl';


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile('index.html')
}
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})



ipcMain.on('install_steam', async (event) => {
    myConsole.log("Install steam server")
    const downloadUrl = 'https://unpkg.com/mvp.css@1.15.0/mvp.css';
    const saveDirectory = basepath+'/downloadfolder'
    const saveFilename = 'SteamSetup.exe'
    //const command = "curl " + url + " --output SteamSetup.exe";

    const win = BrowserWindow.getFocusedWindow();
    myConsole.log("After win")
	try {
        myConsole.log("Before download")
		myConsole.log(await download(win, downloadUrl,{directory:saveDirectory,filename:saveFilename}));
        myConsole.log("After downloda")

	} catch (error) {
        myConsole.log("Error")
		if (error instanceof CancelError) {
			myConsole.info('item.cancel() was called');
		} else {
			myConsole.error(error);
		}
	}
});

