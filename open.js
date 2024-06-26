const {
  ipcMain,
  dialog,
  BrowserWindow
} = require('electron')
const fs = require('fs')


ipcMain.on('open',(event,arg)=>{
  const win = BrowserWindow.getFocusedWindow()
  const options = {
    title:'myOpenFile',
    filters:[
      {
        name:'my file',
        extensions:['md']
      },
      {
        name:'my text',
        extensions:['txt']
      }
    ]
  }
  dialog.showOpenDialog(win,options).then(path=>{
    let {
      filePaths
    } = path
    if(filePaths && filePaths.length > 0){
      const content = fs.readFileSync(filePaths[0]).toString()
      win.webContents.send('load',content)
    }
  })
})