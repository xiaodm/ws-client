## IM WEB Websocket client
与后台组连接服务的集成客户端帮助类,供web页面使用：
* 集成后台组连接服务
* 连接、登录、心跳、重连、发送、订阅消息

### Install
```
  npm install @up/ws-up-client --save
```
### 引用
```
  let wsConn = require('@up/ws-up-client');
  // 或 import wsConn from '@up/ws-up-client';
```

### 连接并注册 - connectServer
```  javascript
  wsConn.connectServer(option, clientInfo, receiveData)
```

* option

连接参数配置，参数说明见下方。

* clientInfo

客户端连接信息，参数说明见下方。

* receiveData

消息订阅方法 - 业务方法。

```  javascript
     let clientInfo = {
          userId: 'testUser1',   // 用户id
          groups:['live_1'],    // 圈子id
          token: 'testUser1'   // 用户token，依实际传递
      };
      let option = {
          wsUrl: 'ws://172.16.8.147:13181/websocket', // 必填项; websocket地址
          bid: '2100',  // 必填项; 业务id
          bName: 'OEMFZQZ', // 必填项; 业务名称
          xua:'app', // 设备类型, 默认app
          reconnectInterval: 1000, // 重连时间间隔,默认1000ms
          heartInterval: 20000 // 心跳执行间隔,默认20000ms
      };
      // 建立连接并注册
      wsConn.connectServer(option, clientInfo, receiveData);

      //接受消息
      const receiveData = function (data) {
          console.log('receive server Data:' + data);
          let retData = JSON.parse(data);
          if(retData.cmd === 7) {
              // cmd:7标识接受业务消息
              let bzData = JSON.parse(JSON.parse(retData.extra_data).dataStr);
              console.log(bzData);
              // TODO 业务处理代码
          }
       };

       // 文字消息 - bzData的格式为：
                    {
                         reqType: 1,  // 1: 文字消息  2：返回的列表消息
                         content: JSON.stringify({type: 1, content: 'test im content2'}),  // type:发送内容类型，由业务自行约定,如(1:文字  2:图片(Base64) 3：图片url 4：短语音url 5：短视频url)   content:消息内容
                         toType: 1, // 发送目标类型 (1：群组  2：私聊)
                         toUId: 'userId1',  // 目标用户id (私聊时赋值)
                         groupId: 'live_1',  // 组id
                         from: 'testUser1',  // 发送者信息
                         master: 2  // 1：圈主发送  2： 用户发送
                   })


      // 查询返回的列表消息 - bzData的格式为：
                         {
                            reqType: 2,  // 1: 文字消息  2：返回的列表消息
                            content: JSON.stringify([msg list]), // 消息列表
                            groupId: 'live_1',  // 组id
                            dir: 1,   // 方向标识 1：向下拉取最新的交易圈内容；2：向上拉取旧的交易圈内容4：短语音url 5：短视频url)
                            st: 0,  // 开始id
                            size: 10,   // 大小
                            master:  2 // 1：圈主消息  2： 圈子所有消息
                         })
```

### 发送消息 - sendMsg
```  javascript
   wsConn.sendMsg({
          reqType: 1,  // 必填项; 1: 发送文字消息  2：查询消息列表
          content: JSON.stringify({type: 1, content: 'test im content2'})  // 必填项; type:发送内容类型，由业务自行约定,如(1:文字  2:图片(Base64) 3：图片url 4：短语音url 5：短视频url)   content:消息内容
          toType: 1, // 必填项; 发送目标类型 (1：群组  2：私聊)
          toUId: 'userId1',  // 私聊时赋值; 目标用户id
          groupId: 'live_1',  // 圈子内消息时赋值; 组id
          from: 'testUser1',  // 必填项; 发送者信息
          master: 2  // 必填项; 1：圈主发送  2： 用户发送
      });
```

### 查询消息 - sendMsg
```  javascript
   wsConn.sendMsg({
          reqType: 2,  // 必填项; 1: 发送文字消息  2：查询消息列表
          groupId: 'live_1',  // 必填项; 组id
          dir: 1,   // 必填项; 方向标识 1：向下拉取最新的交易圈内容；2：向上拉取旧的交易圈内容4：短语音url 5：短视频url)
          st: 0,  // 必填项; 开始id
          size: 10,   // 必填项; 大小
          master:  2 // 必填项; 1：圈主消息  2： 圈子所有消息
      });
```


