/**
 * Created by deexiao on 2018/2/1.
 */
let wsConn = require('../ws-client');

function testConn() {
    let clientInfo = {
        userId: 'testUser1',
        token: 'testUser1'
    };
    let option = {
        wsUrl: 'ws://172.16.8.147:13181/websocket', // websocket地址
        bid: '2100',  // 业务id
        bName: 'OEMFZQZ', // 业务名称
        xua:'app', // 设备类型
        heartInterval: 20000 // 心跳执行间隔
    };
    // 建立连接并注册
    wsConn.connectServer(option, clientInfo, receiveData);
}

function receiveData(data) {
    console.log('receiveData:',data);
}

function send() {
    wsConn.sendMsg({
        content: 'hello 111',  // 发送内容
        type: '1',   // 发送内容类型，由业务自行约定
        targetId: 'live_1',  // 目标id
        groupId: 'live_1',  // 组id
        from: 'testUser1'  // 发送者id
    });
}

// 不支持websocket环境下执行会报错

// 测试建立ws连接，并注册回调
testConn();

// 测试发送消息
send();