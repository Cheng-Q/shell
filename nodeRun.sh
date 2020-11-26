#!/bin/bash
#chkconfig:2345 80 90
#description:nodeRun service
#检测文件内容是否更改
# 检测的文件
# while true
# do
package=/www/server/package.json
server=/www/server/server.js
# server=/Users/cq/Desktop/工作/GIT/Node/server.js
# package=/Users/cq/Desktop/工作/GIT/Node/package.json
# package1=/www/server/package.json


# 记录 md5值的文件
md5=package_md5
servermd5=server_md5
# 创建新的md5信息

# cd /www/server/
package_md5_new=$(md5sum -b $package | awk '{print $1}'|sed 's/ //g')
server_md5_new=$(md5sum -b $server | awk '{print $1}'|sed 's/ //g')

# 创建md5的函数
function creatmd5()
{
  echo $package_md5_new > $md5
}
# 创建md5的函数
function creatmd5Server()
{
  echo $server_md5_new > $servermd5
}
# 判断文件是否存在
if [ ! -f $md5 ] ; then
        echo "packagemd5 不存在,create md5file......."
        creatmd5
        # exit
fi
# 判断文件是否存在
if [ ! -f $servermd5 ] ; then
        echo "servermd5 不存在,create servermd5......."
        creatmd5Server
        # exit
fi
# 读取旧的md5信息

package_md5_old=$(cat $md5|sed 's/ //g')
server_md5_old=$(cat $servermd5|sed 's/ //g')

# package_md5_old1=$(cat $md51|sed 's/ //g')

# while true
# do

echo $package_md5_new
echo $package_md5_old
echo $server_md5_new
echo $server_md5_old

PIDS=`lsof -i:8088 | wc -l`
echo $PIDS
cd /www/server/

if [ "$package_md5_new" == "$package_md5_old" ];then
  echo 'package.json 没有更改'
else
  echo 'package.json 更改了，重新下载依赖'
  creatmd5
  if [ "$PIDS" -gt "0" ]; then
    echo '已经启动了，让我关掉他'
    pm2 start server
    kill -9 $(ps aux | grep server | awk '{print $2}')
    echo "开始下载依赖"
    npm i
    echo "依赖下载完成重新开始服务"
  fi
fi 
if [ "$server_md5_new" == "$server_md5_old" ];then
  echo 'server.js 没有更改'
else
  echo 'server.js 更改了'
  creatmd5Server
fi

# cd /Users/cq/Desktop/工作/GIT/Node/
if [ "$PIDS" -gt "0" ]; then
  echo '已经启动了'
  # kill -9 $(ps aux | grep server | awk '{print $2}')
else  
  echo '没启动,启动它'
  pm2 start server.js
fi
done