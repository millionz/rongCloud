
var demo = {

    user1 : {
        token : '1+aFEEHuJptX0jHbRKbOsBF80TP06cIh+3Nv0MEMSp3Lnxz/Eyq9zGhhZfdUrXV7Vq62CWrVIDWu6KaYUNmQRw==',
        userId : 'user1',
        name : '米烈',
        headPortrait : 'images/A.jpg'
    },

    user2 : {
        token : '2o0otX8kB594kRliPfBs1ruX7i2XLl9HaP3Xga9XiPmXr/FZKSve6U5RvSwaZfsL31aOIQZbW6ana9zXJWA1pw==',
        userId : 'user2',
        name : '小米',
        headPortrait : 'images/B.jpg'
    },

    emojiBoxIsShow : false,

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
        for( var a=0; a<domStr.length; a++ ){ str += domStr[a]; }
        return str;
    },
    getEmojiBackgroundPosition : function( str ){
        for( var a in RongIMLib.RongIMEmoji.emojiFactory ){
            if( RongIMLib.RongIMEmoji.emojiFactory[a].zh == str ) return RongIMLib.RongIMEmoji.emojiFactory[a].bp;
        }
        return 0;
    },
    processChatLog : function( oldChatLog ){
        var emojiReg = /\[([\u2E80-\u9FFF]+|-*[A-Za-z0-9]+)\]/g;
        var newChatLog = oldChatLog.replace( emojiReg , function( str ){
            var emojiBackgroundPosition = demo.getEmojiBackgroundPosition( str.replace('[','').replace(']','') )
            return '<span class="emoji" style="background-position:'+ emojiBackgroundPosition +'"></span>'
        })
        return newChatLog;
    },

    addPicChatLog : function( isOneself , picUrl ){
        var _this = this;
        var domStr = false;
        if( isOneself ){
            domStr = _this.getDomStrFromDomStrBox([
                '<li class="oneSelf">',
                    '<div class="msg-wrap">',
                        '<div class="msg"><img class="chatLog-pic" src="'+ picUrl +'"></div>',
                    '</div>',
                    '<img src="'+ demo.A.headPortrait +'" class="headPortrait">',
                '</li>'
            ]);
        }else{
            domStr = _this.getDomStrFromDomStrBox([
                '<li>',
                    '<img src="'+ demo.B.headPortrait +'" class="headPortrait">',
                    '<div class="msg-wrap">',
                        '<div class="msg"><img class="chatLog-pic" src="'+ picUrl +'"></div>',
                    '</div>',
                '</li>'
            ]);
        }
        $('.js-charLogList').append( domStr );
    },
    
    addTextChatLog : function( isOneself , msg ){
        var _this = this;
        var domStr = false;
        var msg = demo.processChatLog(msg);
        if( isOneself ){
            domStr = _this.getDomStrFromDomStrBox([
                '<li class="oneSelf">',
                    '<div class="msg-wrap">',
                        '<div class="msg">' + msg + '</div>',
                    '</div>',
                    '<img src="'+ demo.A.headPortrait +'" class="headPortrait">',
                '</li>'
            ]);
        }else{
            domStr = _this.getDomStrFromDomStrBox([
                '<li>',
                    '<img src="'+ demo.B.headPortrait +'" class="headPortrait">',
                    '<div class="msg-wrap">',
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
        var emojiBtn = $('.js-emojiBtn');
        var emojiBox = $('.js-emojiBox');
        var blurTapArea = $('.js-blurTapArea');
        var picFile = $('.js-picFile');
        sendMsgBtn.bind({
            tap : function(){
                if( demo.emojiBoxIsShow ){
                    demo.emojiBoxIsShow = !demo.emojiBoxIsShow;
                    demo.emojiBoxIsShow ? emojiBox.show() : emojiBox.hide();
                }
                var inputMsgCon = inputMsg.val();
                if( $.trim(inputMsgCon) == '' ) return;
                _this.sendMsg( user2.userId , inputMsgCon , function( status , result ){
                    if( status ){
                        inputMsg.val('');
                        _this.addTextChatLog( true , inputMsgCon )
                    }
                })
            }
        })
        emojiBtn.bind({
            tap : function(){
                demo.emojiBoxIsShow = !demo.emojiBoxIsShow;
                demo.emojiBoxIsShow ? emojiBox.show() : emojiBox.hide();
            }
        })

        emojiBox.find('span').bind({
            tap : function(){
                inputMsg.val( inputMsg.val() + '[' + $(this).attr('name') + ']' )
            }
        })

        blurTapArea.bind({
            tap : function(){
                if( demo.emojiBoxIsShow ){
                    demo.emojiBoxIsShow = !demo.emojiBoxIsShow;
                    demo.emojiBoxIsShow ? emojiBox.show() : emojiBox.hide();
                }
            }
        })

        inputMsg.bind({
            focus : function(){
                if( demo.emojiBoxIsShow ){
                    demo.emojiBoxIsShow = !demo.emojiBoxIsShow;
                    demo.emojiBoxIsShow ? emojiBox.show() : emojiBox.hide();
                }
            }
        })

        picFile.bind({
            change : function(){
                demo.uploadPic(function( picUrl ){
                    console.log(1.2)
                    demo.sendPicMsg( picUrl , user2.userId );
                })
            }
        })


    },

    uploadPic : function( cb ){

        console.log(1);

        var picFile = $('.js-picFile');
        var selectedFile  = picFile[0].files[0];
        var fileName = selectedFile.name;
        var fileSize = selectedFile.size;
        var form = new FormData();
        form.append( 'key' , 'img/${filename}' );
        form.append( 'file' , selectedFile );
        var oReq = new XMLHttpRequest();

        console.log(2);


        //上传进度监听
        oReq.upload.onprogress = function (e) {
            if(e.type=='progress'){
                var percent = Math.round(e.loaded/e.total*100,2)+'%';
                console.log( '上传进度：' + percent );
            }
        };
        //上传结果
        oReq.onreadystatechange = function( e ){
            if( oReq.readyState == 4 ){
                if( oReq.status == 204 ){
                    console.log( '上传成功' );
                    if( cb !== undefined ) cb( 'http://millionz.oss-cn-shanghai.aliyuncs.com/img/' + fileName );
                }else{
                    console.log( '上传失败' );
                }
            }
        };
        oReq.open( 'POST' , 'http://millionz.oss-cn-shanghai.aliyuncs.com' );
        oReq.send( form );
    },

    getThumbnail: function (obj, area, callback) {
        var canvas = document.createElement("canvas"), context = canvas.getContext('2d');
        var img = new Image();
        img.onload = function () {
            var target_w;
            var target_h;
            var imgarea = img.width * img.height;
            if (imgarea > area) {
                var scale = Math.sqrt(imgarea / area);
                scale = Math.ceil(scale * 100) / 100;
                target_w = img.width / scale;
                target_h = img.height / scale;
            }
            else {
                target_w = img.width;
                target_h = img.height;
            }
            canvas.width = target_w;
            canvas.height = target_h;
            context.drawImage(img, 0, 0, target_w, target_h);
            try {
                var _canvas = canvas.toDataURL("image/jpeg", 0.5);
                _canvas = _canvas.substr(23);
                callback(obj, _canvas);
            }
            catch (e) {
                callback(obj, null);
            }
        };
        img.src = demo.getFullPath(obj);
    },

    getFullPath: function (file) {
        window.URL = window.URL || window.webkitURL;
        if (window.URL && window.URL.createObjectURL) {
            return window.URL.createObjectURL(file);
        }
        else {
            return null;
        }
    },

    sendPicMsg : function( picUrl , targetId ){
        console.log( 'run senPicMsg method' );
        var _this = this;
        var file = $('.js-picFile')[0].files[0];
        console.log( file )
        demo.getThumbnail( file , 60000 , function( obj , data ){
            var im = RongIMLib.ImageMessage.obtain( data , picUrl );

            RongIMLib.RongIMClient.getInstance().sendMessage( RongIMLib.ConversationType.PRIVATE , targetId, im, {
                    onSuccess : function( message ){
                        console.log('图片消息发送成功');
                        _this.addPicChatLog( true , message.content.imageUri )
                    },
                    onError : function(){

                    }
                });
        })













        // demo.getBase64Pic(function( base64 ){
        //
        //     var msg = RongIMLib.ImageMessage.obtain( base64 , picUrl );
        //
        //     var conversationtype = RongIMLib.ConversationType.PRIVATE;
        //
        //
        //     RongIMLib.RongIMClient.getInstance().sendMessage( conversationtype , targetId , msg , {
        //             onSuccess : function( message ){
        //                 console.log('图片消息发送成功');
        //                 _this.addPicChatLog( true , message.content.imageUri )
        //             },
        //             onError: function( errorCode , message ){
        //                 var info = '';
        //                 switch( errorCode ){
        //                     case RongIMLib.ErrorCode.TIMEOUT:
        //                         info = '超时';
        //                         break;
        //                     case RongIMLib.ErrorCode.UNKNOWN_ERROR:
        //                         info = '未知错误';
        //                         break;
        //                     case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
        //                         info = '在黑名单中，无法向对方发送消息';
        //                         break;
        //                     case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
        //                         info = '不在讨论组中';
        //                         break;
        //                     case RongIMLib.ErrorCode.NOT_IN_GROUP:
        //                         info = '不在群组中';
        //                         break;
        //                     case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
        //                         info = '不在聊天室中';
        //                         break;
        //                     default :
        //                         info = x;
        //                         break;
        //                 }
        //                 console.log( '图片消息发送失败:' + info );
        //             }
        //         }
        //     );
        // })














    },

    getBase64Pic : function( cb ){
        var picFile = $('.js-picFile');
        var selectedFile  = picFile[0].files[0];
        var fileName = selectedFile.name;
        var fileSize = selectedFile.size;

        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function(){
            if( cb !== undefined ) cb( this.result )
        };
    },

    selectUser : function( user ){
        if( user == 'A' ){
            demo.A = demo.user1;
            demo.B = demo.user2;
            demo.init( demo.user1 , demo.user2 );
        }else{
            demo.B = demo.user1;
            demo.A = demo.user2;
            demo.init( demo.user2 , demo.user1 );
        }
        $('.select-user').hide();
    },

    init : function( user1 , user2 ){

        var _this = this;

        $('.js-targetName').html( user2.name );

        $('.js-charLogList').css( 'min-height' , $(window).height() - $('.js-targetName').height() - $('.m-chatDetail-ft').height() - 70 )

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
                        _this.addTextChatLog( false , message.content.content );
                        break;
                    case RongIMClient.MessageType.VoiceMessage:
                        // 对声音进行预加载
                        // message.content.content 格式为 AMR 格式的 base64 码
                        RongIMLib.RongIMVoice.preLoaded(message.content.content);
                        break;
                    case RongIMClient.MessageType.ImageMessage:
                        _this.addPicChatLog( false , message.content.imageUri );
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

        //初始化表情包
        RongIMLib.RongIMEmoji.init();

        var emojiFactory = {
            dataSource : RongIMLib.RongIMEmoji.emojiFactory,
            url : RongIMLib.RongIMEmoji.url
        };
        var emojiBox = $('.js-emojiBox');
        var emojiNumber = 90;
        var emojiIndex = 0;
        for( var c in RongIMLib.RongIMEmoji.emojiFactory ){
            if( emojiIndex >= emojiNumber ) break;
            emojiIndex++;
            emojiBox.append( '<span class="emoji" name="'+ RongIMLib.RongIMEmoji.emojiFactory[c].zh +'" code="'+ c +'" emojiIndex="'+ emojiIndex +'" style="background-position: '+ RongIMLib.RongIMEmoji.emojiFactory[c].bp +'"></span>' )
        }

    }
}






$('.js-selectUserA').tap(function(){
    demo.selectUser('A');
})

$('.js-selectUserB').tap(function(){
    demo.selectUser('B');
})