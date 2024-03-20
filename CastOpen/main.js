const { app, BrowserWindow, ipcMain } = require('electron');
const { desktopCapturer } = require('electron');
const path = require('path');
var os = require('os');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      devTools: true,
      sandbox: false,
      contextIsolation: true, 
    }
  });
  let ip = getIp();
  let sourcesList;

  // Get the list of available sources (windows and screens)
  desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    // console.log(sources)
    sourcesList = sources;
  });

  // Handle the setSource IPC message
  ipcMain.handle('setSource', async (event, data) => {
    for (const source of sourcesList) {
      if (source.name === data.sourceName) {
        mainWindow.webContents.send('SET_SOURCE', source.id, data.testMode);
        return;
      }
    }
  });

  // Handle the serverStop IPC message
  ipcMain.handle('serverStop', async (event, data) => {
    mainWindow.webContents.send('serverStop', '');
  });

  // Handle the getIp IPC message
  ipcMain.handle('getIp', async (event, data) => {
    return ip[0];
  });

  // Handle the getSources IPC message
  ipcMain.handle('getSources', async (event, data) => {
    return sourcesList;
  });

  // Handle the quitServer IPC message
  ipcMain.handle('quitServer', () => {
    app.quit();
  });

  // Load the index.html file into the main window
  mainWindow.loadFile('index.html');
  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
}

// Create the window when the app is ready
app.whenReady().then(createWindow);

// Function to get the IP address of the machine
function getIp() {
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses;
}
