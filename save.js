const {
  ipcMain,
  dialog,
  BrowserWindow
} = require('electron')

const fs = require('fs')

ipcMain.on('save',(event,res)=>{
  const win = BrowserWindow.getFocusedWindow()
  const options = {
    title:'mysavefile',
    filters:[
      {
        name:'my file',
        extensions:['md']
      }
    ]
  }
  dialog.showSaveDialog(win,options).then(file=>{ 
    if(file){
      console.log('文件正在导出中 。。。。');
      fs.writeFileSync(file.filePath,res)
    }
  })
})


module.exports = {}