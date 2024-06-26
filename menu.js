const {
  Menu,
  shell,
  app,
  ipcMain, 
  BrowserWindow,
  globalShortcut
} = require('electron')

function handlerEventKeys(keys,eventN){
  globalShortcut.register(keys,()=>{ 
    childEvent('editor-event',eventN)
  })
}
function childEvent(middle,argE){
  const win = BrowserWindow.getFocusedWindow() 
  win.webContents.send( 
    middle, 
    argE 
  )
}


app.on('ready',()=>{
  handlerEventKeys('Command+M','save')
})

app.on('ready',()=>{
  handlerEventKeys('Control+O','open')
})


let template = [
  {
    role:'help', 
    submenu:[
      {
        label:'关于 component editor', 
        click(){ 
          shell.openExternal('https://simplemde.com') 
        }
      }
    ]
  },
  {
    label:'file文件操作',
    submenu:[
      {
        label:'打开文件',
        accelerator:'Control+O',
        click(){
          childEvent('editor-event','open')
        }
      },
      {
        label:'保存文件',
        accelerator:'Command+M',
        click(){
          childEvent('editor-event','save')
        }
      }
    ]
  },
  {
    label:'Debugger', 
    submenu:[
      {
        label:'new Debugger tools', 
        role:'toggleDevTools' 
      },
      {
        type:'separator' 
      },
      {
        role:'reload',
        accelerator:'alt+T' 
      }
    ]
  },
  {
    label:'send message 给线程',
    submenu:[
      {
        label:'发送',
        click(){
          const win = BrowserWindow.getFocusedWindow() 
          win.webContents.send( 
            'editor-event',
            '来自menu 发送的消息'
          )
        }
      },
      {
        label:'变粗',
        click(){
          const win = BrowserWindow.getFocusedWindow() 
          win.webContents.send( 
            'editor-event',
            'bold'
          )
        }
      }
    ]
  }
]

if(process.platform === 'darwin'){ 
  template.unshift({
    label:app.getName(),
    submenu:[
      {role:'about'},
      {type:'separator'},
      {role:'quit'}
    ]
  })
}

if(!process.env.DEBUG){
  template =  deleteItem(template,'Debugger')
}
function deleteItem(arr,label){
  let idx = arr.findIndex(item=>item.label === label)
  if(idx < 0) return arr
  let before = arr.slice(0,idx)
  let after = arr.slice(idx+1,arr.length)
  return before.concat(after)
}


const menu = Menu.buildFromTemplate(template) 

module.exports = menu