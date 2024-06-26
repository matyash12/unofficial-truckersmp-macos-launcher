import { createRequire } from "module";

const require = createRequire(import.meta.url);


const { app, BrowserWindow, ipcMain } = require('electron');

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

var basepath = app.getAppPath();

const { exec } = require('child_process');

const winePath = basepath+"/windowsresources/wine/wine/Contents/Resources/wine/bin/wine"
const steamInstallerExeFile = basepath+"/downloadfolder/SteamSetup.exe"
const winePrefix = basepath + "/windowsresources/wine_prefix"
const steamExeFile = basepath + "/windowsresources/wine_prefix/drive_c/Program Files (x86)/Steam/steam.exe"
//const {download,CancelError} = require("electron-dl");

import { download, CancelError } from 'electron-dl';


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
    const saveDirectory = basepath + '/downloadfolder'
    const saveFilename = 'SteamSetup.exe'
    //const command = "curl " + url + " --output SteamSetup.exe";

    const win = BrowserWindow.getFocusedWindow();
    myConsole.log("After win")
    try {
        myConsole.log("Before download")
        myConsole.log(await download(win, downloadUrl, { directory: saveDirectory, filename: saveFilename }));
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

ipcMain.on('start_steam_installer', async (event) => {
    myConsole.log("Starting steam installer")
    const wholeCommand = 'export WINEPREFIX="'+winePrefix+'"' +" && "+ '"'+ winePath+'"' + " " + '"'+steamInstallerExeFile+'"'

    myConsole.log(wholeCommand)
    exec(wholeCommand);
});


ipcMain.on('start_steam',async (event) =>{
    myConsole.log("Starting steam")
    const wholeCommand = 'export WINEPREFIX="'+winePrefix+'"' +" && "+ '"'+ winePath + '"' + " " +'"'+ steamExeFile+'"'

    myConsole.log(wholeCommand)
    exec(wholeCommand);
});

ipcMain.on('wine_kill_all', async (event) =>{
    myConsole.log("Running killall -9 wine")
    const wholeCommand1 = "killall -9 wine"
    exec(wholeCommand1);

    myConsole.log("Running killall -9 wine-preloader")
    const wholeCommand2 = "killall -9 wine-preloader"
    exec(wholeCommand2);

    myConsole.log("Killed all wine and wine-preloader")
});
