// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { IBookingData } from '@/Pages/(main)/Pending';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },

    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },

    setWindowSize(width: number, height: number) {
      ipcRenderer.send('set-window-size', width, height);
    },

    setWindowFullScreen(shouldFullScreen: boolean) {
      ipcRenderer.send('set-window-full-screen', shouldFullScreen);
    },

    generateDataPDF(data: IBookingData[]){
      return ipcRenderer.invoke('generate-pdf', data);
    },

    reloadWindow(){
      ipcRenderer.send('reload');
    }
  },

  
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
