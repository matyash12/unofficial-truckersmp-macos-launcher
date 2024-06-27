import { createRequire } from "module";

const require = createRequire(import.meta.url);


const { app, BrowserWindow, ipcMain } = require('electron');

const fs = require('fs');
const path = require('path');
const { Console } = require('console');

var basepath = path.join(app.getAppPath() + "/..").toString();
// Create a writable stream
const logStream = fs.createWriteStream(path.join(basepath, 'app.log'), { flags: 'a' });

// Create a new console instance
const fileConsole = new Console({ stdout: logStream, stderr: logStream });

// Example usage
fileConsole.log('This is a message logged to the file.');
fileConsole.error('This is an error logged to the file.');

var myConsole = fileConsole;
//var myConsole = new nodeConsole.Console(process.stdout, process.stderr);



const { exec } = require('child_process');

const winePath = basepath + "/windowsresources/wine/wine/Contents/Resources/wine/bin/wine"
const steamInstallerExeFile = basepath + "/downloadfolder/SteamSetup.exe"
const winePrefix = basepath + "/windowsresources/wine_prefix"
const steamExeFile = basepath + "/windowsresources/wine_prefix/drive_c/Program Files (x86)/Steam/steam.exe"
const truckersmp_cli_path = basepath + "/packages/truckersmp-cli-0.10.2.1/truckersmp-cli"
const ets2_path = winePrefix + "/drive_c/Program Files (x86)/Steam/steamapps/common/Euro Truck Simulator 2"
const steamSaveDirectoryDownload = basepath + '/downloadfolder'
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

function getWineCommandWithOverides(command_to_run) {
    const whole_command_to_run = "export WINEPREFIX=" + '"' + winePrefix + '"' + " && " + 'export WINEDLLOVERRIDES="d3d11=n;d3d10core=n;dxgi=n;d3d9=n"' + " && " + '"' + winePath + '"' + " " + '"' + command_to_run + '"'
    myConsole.log("Running command")
    myConsole.log(whole_command_to_run)
    exec(whole_command_to_run)
    myConsole.log("After running a command")
}

function runCommandWithExports(command_to_run){
    const whole_command_to_run = "export WINEPREFIX=" + '"' + winePrefix + '"' + " && " + 'export WINEDLLOVERRIDES="d3d11=n;d3d10core=n;dxgi=n;d3d9=n" ' + " && "+ command_to_run
    myConsole.log(whole_command_to_run)
    exec(whole_command_to_run)
    myConsole.log("After running a command")
}

function getSafePath(path) {
    return '"' + path + '"';
}



ipcMain.on('install_steam', async (event) => {
    myConsole.log("Install steam server")
    const downloadUrl = 'https://cdn.akamai.steamstatic.com/client/installer/SteamSetup.exe';
    
    const saveFilename = 'SteamSetup.exe'
    //const command = "curl " + url + " --output SteamSetup.exe";

    const win = BrowserWindow.getFocusedWindow();
    myConsole.log("After win")
    try {
        myConsole.log("Before download")
        myConsole.log(await download(win, downloadUrl, { directory: steamSaveDirectoryDownload, filename: saveFilename }));
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
    //myConsole.log("Starting steam installer")
    //const wholeCommand = 'export WINEPREFIX="'+winePrefix+'"' +" && "+ '"'+ winePath+'"' + " " + '"'+steamInstallerExeFile+'"'
    getWineCommandWithOverides(steamInstallerExeFile)
    //myConsole.log(wholeCommand)
    //exec(wholeCommand);
});


ipcMain.on('start_steam', async (event) => {
    //myConsole.log("Starting steam")
    //const wholeCommand = 'export WINEPREFIX="'+winePrefix+'"' +" && "+ '"'+ winePath + '"' + " " +'"'+ steamExeFile+'"'
    getWineCommandWithOverides(steamExeFile)
    //myConsole.log(wholeCommand)
    //exec(wholeCommand);
});
//export WINEDLLOVERRIDES="d3d11=n;d3d10core=n;dxgi=n;d3d9=n" 

ipcMain.on('wine_kill_all', async (event) => {
    myConsole.log("Running killall -9 wine")
    const wholeCommand1 = "killall -9 wine"
    exec(wholeCommand1);

    myConsole.log("Running killall -9 wine-preloader")
    const wholeCommand2 = "killall -9 wine-preloader"
    exec(wholeCommand2);

    myConsole.log("Killed all wine and wine-preloader")
});

ipcMain.on('create_wine_enviroment', async (event) => {
    myConsole.log("Running wineboot")
    const wholeCommand = 'export WINEPREFIX="' + winePrefix + '"' + " && " + '"' + winePath + '"' + " " + "wineboot"
    myConsole.log(wholeCommand)
    exec(wholeCommand);
});


ipcMain.on('move_wine_packages', async (event) => {
    myConsole.log("Moving wine packages")
    const wholeCommand = "export WINEPREFIX=" + getSafePath(winePrefix) + " && " + "cp " + getSafePath(basepath + "/packages/dxvk-2.3.1/x64/") + "*.dll" + " " + getSafePath("$WINEPREFIX/drive_c/windows/system32") + " && " + "cp " + getSafePath(basepath + "/packages/dxvk-2.3.1/x32/") + "*.dll" + " " + getSafePath("$WINEPREFIX/drive_c/windows/syswow64");
    //const wholeCommand = 'export WINEPREFIX=" + " && "+ "cp "+basepath+"/packages/dxvk-2.3.1/x64/*.dll $WINEPREFIX/drive_c/windows/system32" + " && "+ "cp "+basepath+"/packages/dxvk-2.3.1/x32/*.dll $WINEPREFIX/drive_c/windows/syswow64"
    myConsole.log(wholeCommand)
    exec(wholeCommand);
});

ipcMain.on('truckersmp_open_button', async (event) => {
    myConsole.log("Running truckersmp_open_button")
    const wholeCommand = getSafePath(truckersmp_cli_path) + ` start -v -w -g ` + getSafePath(ets2_path) + ` -x ` + getSafePath(winePrefix) + ` --without-wine-discord-ipc-bridge --rendering-backend dx11`
    runCommandWithExports(wholeCommand);

});


