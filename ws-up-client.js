/**
 * Created by deexiao on 2018/02/01.
 * websocket客户端帮助类
 */

module.exports = {
    socket: null,   // websocket对象
    clientInfo: null, // 客户端信息
    requestId: 1,   // ws请求标识
    inters: null,  // 心跳执行对象
    forceClose: false, //是否强制关闭
    config: {
        wsUrl: '', // websocket地址
        bid: '',  // 业务id
        bName: '', // 业务名称
        xua: 'app', // 设备类型
        reconnectInterval: 1000, // 重连时间间隔
        heartInterval: 20000 // 心跳执行间隔
    },
    /**
     * 连接ws服务、注册客户端信息
     * @param option ws相关配置
     * @param clientInfo 客户端信息
     * @param receive 客户端接受消息回调
     */
    connectServer: function (option, clientInfo, receiveData) {
        Object.assign(this.config, option);
        this.clientInfo = clientInfo;
        if (receiveData) {
            this.onmessage = receiveData;
        }
        this.connectServerCore();
    },
    /**
     * 连接服务端，并订阅相关事件
     * @param clientInfo 客户端业务信息
     * @param receive 客户端接受消息回调
     */
    connectServerCore: function () {
        let _self = this;
        if (window && ('WebSocket' in window)) {
            _self.socket = new WebSocket(_self.config.wsUrl);
        }
        else {
            console.log('浏览器不支持webSocket');
        }
        if (_self.socket) {
            _self.socket.onopen = function (e) {
                console.log("websocket连接成功", e);
                _self.onopen(e);
                _self.registerClient(_self.clientInfo);
                _self.heartBeat(_self.clientInfo);
            };
            _self.socket.onclose = function (e) {
                console.log("websocket连接关闭", e);
                _self.onclose(e);
                if (!_self.forceClose) {
                    setTimeout(function () {
                        console.log("reconnect", e);
                        _self.connectServerCore();
                    }, _self.reconnectInterval);
                }
            };
            _self.socket.onmessage = function (e) {
                console.log("websocket接收消息", e);
                _self.onmessage(e.data);
            };
            _self.socket.onerror = function (e) {
                console.log("websocket连接错误", e);
            };
            //监听窗口关闭事件，当窗口关闭时，主动去关闭连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = function () {
                _self.forceClose = true;
                _self.socket.close();
            }
        }
    }
    ,
    /**
     * 注册客户端
     * @param clientInfo
     */
    registerClient: function (clientInfo) {
        var message = {
            cmd: 1,
            requestId: this.requestId++,
            extra_data: JSON.stringify({
                guid: clientInfo.userId,
                xua: this.config.xua,
                uid: clientInfo.userId,
                bid: this.config.bid,
                token: clientInfo.token,
                groups: clientInfo.groups
            })
        };
        this.socket && this.socket.send(JSON.stringify(message));
        console.log('registerClient end');
    },
    /**
     * 发送消息
     * @param paramInfo 消息参数
     */
    sendMsg: function (paramInfo) {
        var message = {
            cmd: 7,
            requestId: this.requestId++,
            extra_data: JSON.stringify({
                baseInfo: {
                    bid: this.config.bid
                },
                data: {
                    cmdType: 1,
                    type: 1,
                    dataStr: JSON.stringify(Object.assign({
                        business: this.config.bName
                    },paramInfo))
                }
            })
        };

        this.socket && this.socket.send(JSON.stringify(message));
    },
    /**
     * 心跳
     * @param clientInfo 客户端信息
     */
    heartBeat: function (clientInfo) {
        let selfSocket = this.socket;
        let _config = this.config;
        if (this.inters) {
            clearInterval(this.inters);
            this.inters = null;
        }
        this.inters = setInterval(function () {
            var message = {
                cmd: 4,
                requestId: this.requestId++,
                extra_data: JSON.stringify({
                    isHeart: 'true',
                    guid: clientInfo.userId,
                    xua: _config.xua,
                    uid: clientInfo.userId,
                    bid: _config.bid,
                    token: clientInfo.token
                })
            };
            selfSocket && selfSocket.send(JSON.stringify(message));
            console.log('sended heartBeat');
        }, _config.heartInterval);

    },
    /**
     * onopen 事件
     */
    onopen: function () {
    },
    /**
     * onmessage 事件
     */
    onmessage: function (data) {
    },
    /**
     * onclose 事件
     */
    onclose: function () {
    },
    /**
     * onerror 事件
     */
    onerror: function () {
    }
}
