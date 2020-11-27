const express = require('express')

const fs = require('fs')
const md5 = require('md5')
const process = require('child_process'); // node 执行cmd命令
// const ls = process.spawn('ls',['-lh','/usr'])
const child = process.spawnSync('ls',['-l','/usr'])
let preveMd5 = null,
    fsWait = false
// console.log('stdout here: \n' + child.stdout);

const filePath = '/www/server/'
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
    aa = process.execFile(`./nodeRun.sh`,['arg1','arg2','arg3'],{//分离和忽略的stdin是这里的关键：
      detached:true,
      stdio:[ 'ignore',1,2]
    })
    //和unref（）会以某种方式使孩子的事件循环与父母的事件循环分离：
    aa.unref(); 
    aa.stdout.on('data',function (data) {
      console.log('shell***' + data);
    });
    // process.exec(`cd /Users/cq/Desktop/工作/GIT/Node/ && mkdir aa && cd aa && mkdir bb`,function(error, stdout, stderr){
    //   console.log(error)
    //   console.log("stdout:",stdout)
    //   console.log("stderr:",stderr);
    // })
  }
})

// child.stdout.on('data',function (data) {
//         console.log('ls command output: ' + data);
//     });
// child.stderr.on('data',function (data) {
//     //throw errors
//     console.log('stderr: ' + data);
// });

// child.on('close',function (code) {
//     console.log('child process exited with code ' + code);
// });
let port = 8000 // 端口
let host = '127.0.0.1'
app.listen(port, host, (res) => {
   console.log(`服务器运行在http://${host}:${port}`);
})
