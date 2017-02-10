
var demo = {

    user1 : {
        token : '1+aFEEHuJptX0jHbRKbOsBF80TP06cIh+3Nv0MEMSp3Lnxz/Eyq9zGhhZfdUrXV7Vq62CWrVIDWu6KaYUNmQRw==',
        userId : 'user1',
        name : '米烈'
    },

    user2 : {
        token : '2o0otX8kB594kRliPfBs1ruX7i2XLl9HaP3Xga9XiPmXr/FZKSve6U5RvSwaZfsL31aOIQZbW6ana9zXJWA1pw==',
        userId : 'user2',
        name : '小米'
    },



    sendMsg : function( targetId , msg , cb ){
        var msg = RongIMLib.TextMessage.obtain( msg );  //消息
        var conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊
        RongIMClient.getInstance().sendMessage( conversationtype, targetId, msg, {
                // 发送消息成功
                onSuccess: function( message ){
                    //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                    console.log("Send successfully");
                    if( cb !== undefined ) cb( true , message );
                },
                onError: function ( errorCode , message ){
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default :
                            info = x;
                            break;
                    }
                    if( cb !== undefined ) cb( false , errorCode , message );
                    console.log('发送失败:' + info);
                }
            }
        );
    },
    
    getDomStrFromDomStrBox : function( domStr ){
        var str = '';
        for( var a in domStr ){ str += domStr[a]; }
        return str;
    },
    
    addChatLog : function( isOneself , msg ){
        var _this = this;
        var domStr = false;
        if( isOneself ){
            domStr = _this.getDomStrFromDomStrBox([
                '<li class="oneSelf">',
                    '<div class="msg-warp">',
                        '<div class="msg">' + msg + '</div>',
                    '</div>',
                    '<img src="images/B.jpg" class="headPortrait">',
                '</li>'
            ]);
        }else{
            domStr = _this.getDomStrFromDomStrBox([
                '<li>',
                    '<img src="images/A.jpg" class="headPortrait">',
                    '<div class="msg-warp">',
                        '<div class="msg">' + msg + '</div>',
                    '</div>',
                '</li>'
            ]);
        }
        $('.js-charLogList').append( domStr );
    },

    eventBind : function( user2 ){
        var _this = this;
        var inputMsg = $('.js-inputMsg');
        var sendMsgBtn = $('.js-sendMsgBtn');
        sendMsgBtn.bind({
            tap : function(){
                var inputMsgCon = inputMsg.html();
                _this.sendMsg( user2.userId , inputMsgCon , function( status , result ){
                    if( status ){
                        inputMsg.html('');
                        _this.addChatLog( true , inputMsgCon )
                    }
                })
            }
        })
    },


    selectUser : function( user ){
        if( user == 'A' ){
            demo.init( demo.user1 , demo.user2 );
        }else{
            demo.init( demo.user2 , demo.user1 );
        }
        $('.select-user').hide();
    },

    init : function( user1 , user2 ){

        var _this = this;

        $('.js-targetName').html( user2.name );

        RongIMClient.init('tdrvipkstdbu5');
        // 设置连接监听状态 （ status 标识当前连接状态）
        // 连接状态监听器
        RongIMClient.setConnectionStatusListener({
            onChanged : function( status ){
                switch( status ){
                    //链接成功
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功');
                        break;
                    //正在链接
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    //重新链接
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        break;
                    //其他设备登录
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('其他设备登录');
                        break;
                    //网络不可用
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用');
                        break;
                }
            }
        });
        // 消息监听器
        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived : function( message ){
                // 判断消息类型
                switch( message.messageType ){
                    case RongIMClient.MessageType.TextMessage:
                        // 发送的消息内容将会被打印
                        _this.addChatLog( false , message.content.content );
                        break;
                    case RongIMClient.MessageType.VoiceMessage:
                        // 对声音进行预加载
                        // message.content.content 格式为 AMR 格式的 base64 码
                        RongIMLib.RongIMVoice.preLoaded(message.content.content);
                        break;
                    case RongIMClient.MessageType.ImageMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.LocationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.RichContentMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.InformationNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ContactNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ProfileNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.UnknownMessage:
                        // do something...
                        break;
                    default:
                    // 自定义消息
                    // do something...
                }
            }
        });
        // 连接融云服务器。



        RongIMClient.connect( user1.token , {
            onSuccess : function( userId ){
                console.log( 'Login successfully.' + userId );
                //绑定事件
                _this.eventBind( user2 );
                console.log( '开始绑定事件' );
            },
            onTokenIncorrect : function(){
                console.log('token无效');
            },
            onError:function( errorCode ){
                var info = '';
                switch( errorCode ){
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                        info = '不可接受的协议版本';
                        break;
                    case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                        info = 'appkey不正确';
                        break;
                    case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                        info = '服务器不可用';
                        break;
                }
                console.log( errorCode );
            }
        });
    }
}






$('.js-selectUserA').tap(function(){
    demo.selectUser('A');
})

$('.js-selectUserB').tap(function(){
    demo.selectUser('B');
})