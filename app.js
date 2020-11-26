const express = require('express')

const fs = require('fs')
const md5 = require('md5')
const process = require('child_process') // node 执行cmd命令
// const ls = process.spawn('ls',['-lh','/usr'])
const ls = process.spawn('ls',['-lh','/usr'])
let preveMd5 = null,
    fsWait = false

const filePath = '/Users/cq/Desktop/工作/GIT/Node/server.js'
const app = express()
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
  res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
  res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
})
console.log(`正在监听${filePath}`)
fs.watch(filePath,(event,filename) => {
  if (filename){
    if (fsWait) return;
    fsWait = setTimeout(() => {
        fsWait = false;
    }, 100)
    var currentMd5 = md5(fs.readFileSync(filePath))
    if (currentMd5 == preveMd5){
        return 
    }
    preveMd5 = currentMd5
    console.log(`${filePath}文件发生更新`)
    process.exec(`./nodeRun.sh`,function(error, stdout, stderr){
      console.log(error)
      console.log("stdout:",stdout)
      console.log("stderr:",stderr);
    })
    // process.exec(`cd /Users/cq/Desktop/工作/GIT/Node/ && mkdir aa && cd aa && mkdir bb`,function(error, stdout, stderr){
    //   console.log(error)
    //   console.log("stdout:",stdout)
    //   console.log("stderr:",stderr);
    // })
  }
})
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// ls.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });
// ls.on('exit', (code) => {

//   console.log(`child process exited with code ${code}`);

// });
let port = 8000 // 端口
let host = '127.0.0.1'
app.listen(port, host, (res) => {
   console.log(`服务器运行在http://${host}:${port}`);
})
