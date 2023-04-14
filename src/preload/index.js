import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { fetchData, fetchTotalConns, showDatabases, showTables, executeSql, executeParams } from './Database'
import {getTabs, setTabs, increatCounter, getCounter} from './Constant'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
console.log(process.contextIsolated)
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('database', {
      fetchData, fetchTotalConns, showDatabases, showTables, executeSql, executeParams
    })
    contextBridge.exposeInMainWorld('constant', {
      getTabs, setTabs, increatCounter, getCounter
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}