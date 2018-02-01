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
          token: 'testUser1'   // 用户token，依实际传递
      };
      let option = {
          wsUrl: 'ws://172.16.8.147:13181/websocket', // websocket地址
          bid: '2100',  // 业务id
          bName: 'OEMFZQZ', // 业务名称
          xua:'app', // 设备类型, 默认app
          reconnectInterval: 1000, // 重连时间间隔,默认1000ms
          heartInterval: 20000 // 心跳执行间隔,默认20000ms
      };
      // 建立连接并注册
      wsConn.connectServer(option, clientInfo, receiveData);
```

### 发送消息 - connectServer
```  javascript
   wsConn.sendMsg({
          content: 'hello 111',  // 发送内容
          type: '1',   // 发送内容类型，由业务自行约定,如(1:文字  2:图片(Base64) 3：图片url 4：短语音url 5：短视频url)
          targetId: 'live_1',  // 目标id
          groupId: 'live_1',  // 组id
          from: 'testUser1'  // 发送者id
      });
```