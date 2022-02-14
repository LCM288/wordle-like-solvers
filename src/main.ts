import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

const createWindow = (): void => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadURL(
    isDev ? "http://localhost:9000" : `file://${app.getAppPath()}/index.html`
  );
};

app
  .whenReady()
  .then(() => {
    if (isDev) {
      return installExtension(REACT_DEVELOPER_TOOLS);
    }
  })
  .then(() => createWindow());
