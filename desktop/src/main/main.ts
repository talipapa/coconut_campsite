import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';
import { IBookingData } from '@/Pages/(main)/Pending';
import puppeteer from 'puppeteer';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// Resize window
ipcMain.on('set-window-size', (event, width, height) => {
  mainWindow?.setSize(width, height);
  mainWindow?.center();
});

// Toggle full-screen
ipcMain.on('set-window-full-screen', (event, shouldFullscreen) => {
  mainWindow?.setFullScreen(shouldFullscreen);
});


ipcMain.on('reload', () => {
  mainWindow?.close();

})


ipcMain.handle('generate-pdf', async (event, reservationData) => {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
  const defaultFileName = `booking_data_${formattedDate}_${formattedTime}.pdf`;
  try {
    // Prompt user for the save location
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save PDF',
      // Use the current date and time as the default file name
      defaultPath: defaultFileName,
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
    });

    if (!filePath) {
      return { success: false, error: 'Save canceled by user' };
    }
    const htmlTemplatePath = path.join(
      app.isPackaged ? process.resourcesPath : __dirname, // if packaged, use resourcesPath
      'assets', 'Templates', 'reservationTemplate.html'
    );

    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8'); 
  
    const rows = reservationData
    .map((reservation: IBookingData) => {
      console.log(reservation); // Log the reservation object
      return `
        <tr>
          <td>${`${reservation.first_name} ${reservation.last_name}`}</td>
          <td>${reservation.email}</td>
          <td>${reservation.booking_type}</td>
          <td>${reservation.check_in}</td>
          <td>${reservation.check_out}</td>
          <td>${reservation.status}</td>
        </tr>
      `;
    })
    .join('');
    
    const populatedHtml = htmlTemplate.replace(
      '<tbody id="data-rows"></tbody>',
      `<tbody>${rows}</tbody>`
    );


    const browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(),
      headless: false, 
    });

    const page = await browser.newPage();
    await page.setContent(populatedHtml);

    const pdf = await page.pdf({
      path: filePath, 
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      printBackground: true,
    });

    await browser.close();

    // Open the folder containing the saved PDF and highlight the file
    shell.showItemInFolder(filePath);

    return { success: true, filePath };
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    // Get the path to the Downloads folder
    const downloadsFolder = app.getPath('downloads');
    const errorLogPath = path.join(downloadsFolder, 'generate-pdf-error-log.txt');

    // Write the error message to the error log file
    const errorMessage = `Error occurred on ${new Date().toISOString()}:\n${(error as Error).stack || (error as Error).message}\n\n`;
    fs.appendFileSync(errorLogPath, errorMessage, 'utf8');  // Append error to the log file

    return { success: false, error: (error as Error).message };
  }
});





if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer.default(extensions.map((name) => installer[name]), forceDownload).catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => path.join(RESOURCES_PATH, ...paths);

  mainWindow = new BrowserWindow({
    show: false,
    minWidth: 900,
    minHeight: 650,
    autoHideMenuBar: true,
    icon: getAssetPath('logo.jpg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false,
      
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  new AppUpdater();
};


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
