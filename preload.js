const { contextBridge, shell } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openExternal: (url) => shell.openExternal(url),
    openPath: (path) => shell.openPath(path) // Add this line
});