const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
// Dynamically import electron-store
let store;

(async () => {
    const Store = (await import('electron-store')).default;
    store = new Store();

    // It's important to create the window inside this async function
    // or after the store has been initialized
    app.whenReady().then(createWindow);
})();

function createWindow() {
    // Ensure store is initialized before accessing it
    if (!store) {
        console.error('Store not initialized');
        return;
    }

    // First, get the saved window size and position.
    let { width, height, x, y } = store.get('windowBounds', { width: 1280, height: 720 });

    const mainWindow = new BrowserWindow({
        x,
        y,
        width,
        height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets/ToDo List.png')
    });

    mainWindow.loadFile('ToDo List.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});