import { createRequire } from "module";

const require = createRequire(import.meta.url);


const { app, BrowserWindow, ipcMain } = require('electron');

const fs = require('fs');
const path = require('path');
const { Console } = require('console');

//var basepath = path.join(app.getAppPath() + "/..").toString(); //production
var basepath = path.join(app.getAppPath() + "/Resources").toString(); //devel

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


var win = null


const createWindow = () => {
    win = new BrowserWindow({
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




    async function checkSteamInstallation() {
        await waitOneSecond()
        while (!check_if_steam_installed()) {
            myConsole.log("Steam is not yet installed. Waiting one second before trying again.");
            await waitOneSecond();
        }
    }
    checkSteamInstallation();
    
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

function runCommandWithExports(command_to_run) {
    const whole_command_to_run = "export WINEPREFIX=" + '"' + winePrefix + '"' + " && " + 'export WINEDLLOVERRIDES="d3d11=n;d3d10core=n;dxgi=n;d3d9=n" ' + " && " + command_to_run
    myConsole.log(whole_command_to_run)
    exec(whole_command_to_run)
    myConsole.log("After running a command")
}

function getSafePath(path) {
    return '"' + path + '"';
}


async function install_steam() {
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
}


ipcMain.on('install_steam', async (event) => {
    await install_steam();
});

async function start_steam_installer() {
    getWineCommandWithOverides(steamInstallerExeFile)
}
ipcMain.on('start_steam_installer', async (event) => {
    //myConsole.log("Starting steam installer")
    //const wholeCommand = 'export WINEPREFIX="'+winePrefix+'"' +" && "+ '"'+ winePath+'"' + " " + '"'+steamInstallerExeFile+'"'
    await start_steam_installer();
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

async function create_wine_enviroment() {
    myConsole.log("Running wineboot")
    const wholeCommand = 'export WINEPREFIX="' + winePrefix + '"' + " && " + '"' + winePath + '"' + " " + "wineboot"
    myConsole.log(wholeCommand)
    exec(wholeCommand);
}
ipcMain.on('create_wine_enviroment', async (event) => {
    await create_wine_enviroment();
});


async function move_wine_packages() {
    myConsole.log("Moving wine packages")
    const wholeCommand = "export WINEPREFIX=" + getSafePath(winePrefix) + " && " + "cp " + getSafePath(basepath + "/packages/dxvk-2.3.1/x64/") + "*.dll" + " " + getSafePath("$WINEPREFIX/drive_c/windows/system32") + " && " + "cp " + getSafePath(basepath + "/packages/dxvk-2.3.1/x32/") + "*.dll" + " " + getSafePath("$WINEPREFIX/drive_c/windows/syswow64");
    //const wholeCommand = 'export WINEPREFIX=" + " && "+ "cp "+basepath+"/packages/dxvk-2.3.1/x64/*.dll $WINEPREFIX/drive_c/windows/system32" + " && "+ "cp "+basepath+"/packages/dxvk-2.3.1/x32/*.dll $WINEPREFIX/drive_c/windows/syswow64"
    myConsole.log(wholeCommand)
    exec(wholeCommand);
}

ipcMain.on('move_wine_packages', async (event) => {
    await move_wine_packages();
});

ipcMain.on('truckersmp_open_button', async (event) => {
    myConsole.log("Running truckersmp_open_button")
    const wholeCommand = getSafePath(truckersmp_cli_path) + ` start -v -w -g ` + getSafePath(ets2_path) + ` -x ` + getSafePath(winePrefix) + ` --without-wine-discord-ipc-bridge --rendering-backend dx11`
    runCommandWithExports(wholeCommand);

});

function Allow_other_easy_buttons(value) {
    win.webContents.send("other_easy_buttons_allowed", value)
}

async function checkIfWineRunning() {
    return new Promise((resolve, reject) => {
        exec("ps aux | grep -i wine | grep -v grep", (error, stdout, stderr) => {
            myConsole.log(error);
            myConsole.log(stdout);
            myConsole.log(stderr);
            // If the output is empty, Wine is not running
            resolve(stdout.trim().length > 0);
        });
    });
}

async function WaitForWine() {
    await new Promise((resolve) => {
        // Wait for 5 seconds before starting the checks
        setTimeout(() => {
            async function checkWine() {
                const wineStopped = !(await checkIfWineRunning()); // Invert to check if Wine has stopped

                if (wineStopped) {
                    resolve();
                } else {
                    setTimeout(checkWine, 1000); // Check again after 1 second
                }
            }

            checkWine();
        }, 5000); // 5000 milliseconds = 5 seconds
    });

    console.log('Wine has stopped.');
}

function waitOneSecond() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

/*
Install Steam installer.
Create wine enviroment
Move dx11 file to wine
Open Steam installer.
Allow open Steam Button
End
*/
ipcMain.on('easy_install', async (event) => {
    myConsole.log("Running easy_install")

    myConsole.log("Downloading Steam Installer.")
    await install_steam();

    myConsole.log("Creating Wine enviroment")
    await create_wine_enviroment();

    myConsole.log("Waiting for wine to finish")
    await WaitForWine();
    myConsole.log("Waiting for wine has Finished");

    myConsole.log("Moving dx11 files to wine folder")
    await move_wine_packages();

    myConsole.log("Waitiing one second to finish")
    await waitOneSecond();

    myConsole.log("Opening Steam Installer")
    await start_steam_installer();

    myConsole.log("Check if installed")
    while (check_if_steam_installed() == false){
        myConsole.log("Steam is not yet installed waiting one second before trying again.")
        await waitOneSecond();
    }
    

    myConsole.log("Easy install Finished!")
});



//check if wine is already installed
function check_if_steam_installed() {
    myConsole.log("CHecking if steam exe file exists")
    if (fs.existsSync(steamExeFile)) {
        myConsole.log("Steam exe file exists")
        Allow_other_easy_buttons(true)
        return true;
    } else {
        myConsole.log("Steam exe file does not exists")
        Allow_other_easy_buttons(false)
        return false;
    }
}
