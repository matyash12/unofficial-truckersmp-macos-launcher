const { ipcRenderer } = require('electron');

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

const steam_install_button = document.getElementById('steam_install_button');
const steam_open_button = document.getElementById('steam_open_button');
const truckersmp_open_button = document.getElementById('truckersmp_open_button');


steam_install_button.addEventListener('click', () => {
    myConsole.log('Hello World!');
    ipcRenderer.send('install_steam');
});
