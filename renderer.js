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

const open_advanced = document.getElementById('open_advanced');
const close_advanced = document.getElementById('close_advanced');
const advanced_div = document.getElementById('advanced_div');

//easy controls
const easy_install_button = document.getElementById('easy_install_button');
const easy_open_steam_button = document.getElementById('easy_open_steam_button');
const easy_open_truckersmp_button = document.getElementById('easy_open_truckersmp_button');

easy_install_button.addEventListener('click', () => {
    ipcRenderer.send('easy_install');
});
easy_open_steam_button.addEventListener('click', () => {
    ipcRenderer.send('start_steam');
});
easy_open_truckersmp_button.addEventListener('click', () => {
    ipcRenderer.send('truckersmp_open_button');
});







steam_install_button.addEventListener('click', () => {
    ipcRenderer.send('install_steam');
});

steam_installer_open_button.addEventListener('click', () => {
    ipcRenderer.send('start_steam_installer')
});

steam_open_button.addEventListener('click', () => {
    ipcRenderer.send('start_steam')
});
wine_kill_all.addEventListener('click', () => {
    ipcRenderer.send('wine_kill_all')
});

create_wine_enviroment.addEventListener('click', () => {
    ipcRenderer.send('create_wine_enviroment')
});

move_wine_packages.addEventListener('click', () => {
    ipcRenderer.send('move_wine_packages')
});

truckersmp_open_button.addEventListener('click', () => {
    ipcRenderer.send('truckersmp_open_button')
});


//advanced_div control
open_advanced.addEventListener('click', () => {
    advanced_div.hidden = false
});
close_advanced.addEventListener('click', () => {
    advanced_div.hidden = true
});


//recievign from backend
ipcRenderer.on('other_easy_buttons_allowed', (event, data) => {
    if (data == true){
        easy_install_button.disabled = true;
        easy_open_steam_button.disabled = false;
        easy_open_truckersmp_button.disabled = false;
    }else{
        easy_install_button.disabled = false;
        easy_open_steam_button.disabled = true;
        easy_open_truckersmp_button.disabled = true;
    }
});