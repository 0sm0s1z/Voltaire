const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const express = require('express'); //your express app
var http = require('http');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


function createWindow() {
    // Start Express
    var appServer = express();
   appServer.use(express.static(path.join(__dirname, '')));

   appServer.get('*', (req, res) => {
       res.sendFile(__dirname + '/../build/index.html');
   });

   http.createServer(appServer).listen(3007, function() {
       console.log('Express server listening on port');
   });
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1000, height: 800, frame: false});

    mainWindow.setMenu(null);

    // and load the index.html of the app.
    //const startUrl = process.env.ELECTRON_START_URL || url.format({
   //         pathname: path.join(__dirname, '/../build/index.html'),
   //         protocol: 'file:',
   //         slashes: true
   //     });
    //mainWindow.loadURL(startUrl);
    mainWindow.loadURL('http://localhost:3007/');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
