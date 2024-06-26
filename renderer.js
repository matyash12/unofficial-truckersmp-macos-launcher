const { ipcRenderer } = require('electron');

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

const steam_install_button = document.getElementById('steam_install_button');
const steam_installer_open_button = document.getElementById('steam_installer_open_button');
const steam_open_button = document.getElementById('steam_open_button');
const wine_kill_all = document.getElementById('wine_kill_all');
const truckersmp_open_button = document.getElementById('truckersmp_open_button');
const create_wine_enviroment = document.getElementById('create_wine_enviroment');
const move_wine_packages = document.getElementById('move_wine_packages');


steam_install_button.addEventListener('click', () => {
    myConsole.log('Hello World!');
    ipcRenderer.send('install_steam');
});

steam_installer_open_button.addEventListener('click', () =>{
    ipcRenderer.send('start_steam_installer')
});

steam_open_button.addEventListener('click', () =>{
    ipcRenderer.send('start_steam')
});
wine_kill_all.addEventListener('click', () =>{
    ipcRenderer.send('wine_kill_all')
});

create_wine_enviroment.addEventListener('click', () =>{
    ipcRenderer.send('create_wine_enviroment')
});

move_wine_packages.addEventListener('click', ()=>{
    ipcRenderer.send('move_wine_packages')
});

truckersmp_open_button.addEventListener('click', ()=>{
    ipcRenderer.send('truckersmp_open_button')
});