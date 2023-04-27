/*
* Vesca Ark POS連携仕様 Full Featured TypeのWeb Socket通信プロトコル版通信モジュール
* VescaJS FullFeatured-WS
* @Copyright Vesca Co.,Ltd. @Since 2020
* @Licence Vesca Co.,Ltd.
* @auther Vesca Engineering Team dev-partner@vesca.co.jp
* @version 0.1
*/
"use strict";

/**
 * cls 処理中のインスタンス変数  処理中のインスタンス
 * @type {VescaJSFullFeaturedWS}
 */
var cls = null;
/**
 * 処理遅延を関する確認間隔：1000 指定した間隔で接続処理のタイムアウト越えの確認を行う
 * @constant
 * @type {int}
 * @default 1000
 */
const CHECK_INTERVAL=1000;
/**
 * Pollingのリトライ回数
 * @constant
 * @type {int}
 * @default 3
 */
const MAX_POLLING_RETRY=3;
/**
 * NAKのリトライ回数
 * @constant
 * @type {int}
 * @default 3
 */
const MAX_NAK_RETRY=3;
/**
 * ACK 受信完了通知データ
 * FullFeaturedWSはACKを文字列として扱います
 * @type {String}
 */
const ACK="ACK";
/**
 * NAK 受信失敗通知データ
 * FullFeaturedWSはNAKを文字列として扱います
 * @type {String}
 */
const NAK="NAK";
/**
 * レスポンスコード:0000:許可応答：コマンド正常終了
 * @type {String}
 */
const RESPONSE_CODE_OK = "0000";
/**
 * レスポンスコード:0001:保留応答：処理中
 * @type {String}
 */
const RESPONSE_CODE_PROCESSING = "0001";
/**
 * レスポンスコード:0100:障害応答：コマンド未定義
 * @type {String}
 */
const RESPONSE_CODE_UNDEFINED = "0100";
/**
 * レスポンスコード:0101:障害応答：コマンドシーケンス異常
 * @type {String}
 */
const RESPONSE_CODE_INVALID_SEQUENCE = "0101";
/**
 * レスポンスコード:0102:障害応答：コマンドパラメーターエラー
 * @type {String}
 */
const RESPONSE_CODE_INVALID_PARAMETER = "0102";
/**
 * レスポンスコード:0110:障害応答：キャンセル
 * @type {String}
 */
const RESPONSE_CODE_CANCEL = "0110";
/**
 * レスポンスコード:0129:障害応答：デバイスエラー(通信)
 * @type {String}
 */
const RESPONSE_CODE_DEVICE_ERROR = "0129";
/**
 * レスポンスコード:0130:障害応答：POS連動解除中
 * @type {String}
 */
const RESPONSE_CODE_UNACCEPTABLE = "0130";
/**
 * レスポンスコード:0140:障害応答：その他（レシート再印刷が必要）
 * @type {String}
 */
const RESPONSE_CODE_RECEIPT_TROUBLE = "0140";
/**
 * レスポンスコード:1001:障害応答：停止中（自動再起動前）
 * @type {String}
 */
const RESPONSE_CODE_BEFORE_REBOOT = "1001";
/**
 * 実行状況:初期化時 0
 * @type {int}
 */
const STEP_NONE        =0;
/**
 * 実行状況:開始 1
 * @type {int}
 */
const STEP_START        =1;
/**
 * 実行状況:前処理 2
 * @type {int}
 */
const STEP_PREPROCESS   =2;
/**
 * 実行状況:リクエストデータ作成 3
 * @type {int}
 */
const STEP_BUILDREQUEST =3;
/**
 * 実行状況:通信開始 4
 * @type {int}
 */
const STEP_COMMUNICATE  =4;
/**
 * 実行状況:端末と接続完了 5
 * @type {int}
 */
const STEP_CONNECTED    =5;
/**
 * 実行状況:端末にリクエストデータ送信 6
 * @type {int}
 */
const STEP_SENT_REQUEST =6;
/**
 * 実行状況:端末にポーリングデータ送信待ち 7
 * @type {int}
 */
const STEP_WAIT_SEND_AP =7;
/**
 * 実行状況:端末からACK/NAK待ち 8
 * @type {int}
 */
const STEP_WAIT_ACK_NAK =8;
/**
 * 実行状況:端末からレスポンス待ち 9
 * @type {int}
 */
const STEP_WAIT_RESPONSE =9;
/**
 * 実行状況:レスポンス受信 10
 * @type {int}
 */
const STEP_RECEIVEDRESULT=10;
/**
 * 実行状況:結果解析 11
 * @type {int}
 */
const STEP_PARSERESULT  =11;
/**
 * 実行状況:成功完了 12
 * @type {int}
 */
const STEP_FINISHED     =12;
/**
 * 実行状況:エラー終了 13
 * @type {int}
 */
const STEP_ERRORFINISHED=13;
/**
 * 通信断再接続中 14
 * @type {int}
 */
const STEP_RECONNECT=14;
/**
 * STEPと連動したタイムアウト値 3 秒　STARTからPREPROCESSまでこの範囲内で実行したらタイムアウトしない(ここでTimeoutすることは基本的にない)
 * @constant
 * @type {int}
 * @default 3000
 */
const TIMEOUT_PREPROCESS    =1000;
/**
 * STEPと連動したタイムアウト値 3 秒　PREPROCESSからBUILDREQUESTまでこの範囲内で実行したらタイムアウトしない(ここでTimeoutすることは基本的にない)
 * @constant
 * @type {int}
 * @default 3000
 */
const TIMEOUT_BUILDREQUEST  =1000;
/**
 * STEPと連動したタイムアウト値 3 秒　BUILDREQUESTからCOMMUNICATEまでこの範囲内で実行したらタイムアウトしない(ここでTimeoutすることは基本的にない)
 * @constant
 * @type {int}
 * @default 3000
 */
const TIMEOUT_COMMUNICATE   =1000;
/**
 * STEPと連動したタイムアウト値:コネクションタイムアウト 5 秒　COMMUNICATETからCONNECTEDまでこの範囲内で実行したらタイムアウトしない
 * @constant
 * @type {int}
 * @default 5000
 */
const TIMEOUT_CONNECTED     =5000;
/**
 * A1用のACK/NAK待ちタイムアウトms（初回接続のみ5000）
 * @constant
 * @type {int}
 * @default 2500
 */
const TIMEOUT_ACK_NAK_A1=5000;
/**
 * AP用のACK/NAK待ちタイムアウトms
 * @constant
 * @type {int}
 * @default 4000
 */
const TIMEOUT_ACK_NAK_AP=4000;
/**
 * AC用のACK/NAK待ちタイムアウトms
 * @constant
 * @type {int}
 * @default 1000
 */
const TIMEOUT_ACK_NAK_AC=1000;
/**
 * レスポンス受信待ちタイムアウトms
 * @constant
 * @type {int}
 * @default 3000
 */
const TIMEOUT_RESPONSE=3000;
/**
 * AP送信間隔ms
 * @constant
 * @type {int}
 * @default 500
 */
const TIMEOUT_AP=500;
/**
 * 再接続待ち
 * @constant
 * @type {int}
 * @default 3000
 */
const TIMEOUT_RECONNECT=3000;
/**
 * RESULTタイプ：取引成立 OutputCompleteEvent
 * @type {String}
 */
 const RESULT_SUCCESS = "OutputCompleteEvent";
 /**
  * RESULTタイプ：取引不成立またはキャンセル　ErrorEvent
  * @type {String}
  */
 const RESULT_ERROR = "ErrorEvent";

 const CAUSE_CMD_RETRY_COUNT  = "RetryOver";
 const CAUSE_CMD_FORMAT       = "CommandFormat";
 const CAUSE_CMD_SEQ_ERR      = "IllegalSequence";
 const CAUSE_RES_TIMEOUT      = "ResponseTimeout";
 const CAUSE_POS_FORCE_CANCEL = "POSForceCancelled";
 const CAUSE_RES_CD_ERROR     = "ErrorResponseCode";
 const CAUSE_DEVICE_BUSY      = "DeviceBusy";
 const CAUSE_JSON_PARSE       = "ParseJSONError";
 const CAUSE_ACK_TIMEOUT      = "AckTimeout";
 const CAUSE_CONNECTION       = "ConnectionError";
 const CAUSE_SEND_CMD         = "SendCommandError";
 const CAUSE_SEND_ACK         = "SendAckError";
 const CAUSE_SEND_NAK         = "SendNakError";
 const CAUSE_SEND_AP          = "SendAPError";
 const CAUSE_SEND_AC          = "SendACError";
 const CAUSE_NET_DOWN         = "NetworkDown";
 const CAUSE_NET_ERROR        = "NetworkError";
/**
 * Status of Cancel Request.
 */
 var CancelStatus = {
    none : 0,
    pending : 1,
    rejected : 2,
    accepted : 3
};
/**
 * ResponseCodeType
 */
var ResponseCodeType = {
    unknown : 0,
    request_accepted : 1,
    request_rejected : 2,
    cancel_accepted : 3,
    cancel_rejected : 4,
    pending : 5,
    completed : 6,
    error : 9
}
/**
 * Wrapper function for logging
 * @param {String} msg 
 * @private
 */
function log(msg) {
    if (msg != null){
        console.log("["+new Date().toISOString()+"] "+msg);
    }
}
/**
 * Wrapper function for error logging
 * @param {String} msg 
 * @private
 */
function error(msg) {
    if (msg != null){
        console.error("["+new Date().toISOString()+"] "+msg);
    }
}
/**
 * エラー情報: VescaJSFullFeaturedWS呼び出しにより発生したエラー情報(JSON)
 * ErrorCode:990: VescaJSFullFeaturedWSモジュール内部で発生したエラー
 * ErrorCode:900: 端末とモジュール間で発生した端末内部のレスポンスコードエラー
 * ErrorCode:114: 決済処理エラーもしくは端末内部で検知したキャンセル
 * @return {ErrorInfo} ErrorEvent
 * @private
 */
function ErrorInfo(errorcodeDetail, message, isInternal=true){
    var errorCode = isInternal?990:900;
    if (message == null){
        this._resultData = {"ErrorEvent":{    
            "ErrorCode":errorCode,
            "ErrorCodeExtended":-1,
            "Errorcodedetail": errorcodeDetail}};
    } else {
        this._resultData = {"ErrorEvent":{    
            "ErrorCode":errorCode,
            "ErrorCodeExtended":-1,
            "Errorcodedetail": errorcodeDetail,
            "Message": message}};
    }
}
/**
 * Base64をデコード。UTF-8対応
 * @param {string} base64str 
 */
function Base64Decode(base64str) {
    return new TextDecoder().decode(Uint8Array.from(atob(base64str), c => c.charCodeAt(0)));
}
/**
 * Base64にエンコード。UTF-8対応
 * @param {string} utf8str 
 */
function Base64Encode(utf8str) {
    var buffer = new TextEncoder().encode(utf8str);
    var binary = [];
    var bytes = new Uint8Array(buffer);
    for (var i = 0, il = bytes.byteLength; i < il; i++) {
        binary.push(String.fromCharCode(bytes[i]));
    }
    return btoa(binary.join(''));
}
/**
 * WebSocketを使ったSimpleIFの実装クラス
 * _が先頭に着くfunctionおよび変数はクラス内部利用用
 * @class
 * @public
 */
class VescaJSFullFeaturedWS {

    /**
    * VescaJSSimpleIFWSのコンストラクタ
    * @constructor
    * @param {String} host 端末のIPアドレスを指定
    * @param {Number} port 端末のPortを指定
    * @public
    */
    constructor(host, port){
        this._host = host;
        this._port = port;

        this._requestStr=null;//base64 request
        this._resultData=null;//response json
        this._responseStr=null;//base64 response
        this._lastCommand=null;
        this._nakRetryCount=0;//nak retryCount
        this._cmdRetryCount=0;//AP,AC retryCount
        this._cancelStatus=CancelStatus.none;//AC Status

        
        this._client=null;//WebSocket client
        this._listener=null;//response listener
        this._lastStepTimestamp=Date.now();
        this._intervalId=setInterval(this._checkProcessing.bind(this), CHECK_INTERVAL);
        this._step = STEP_NONE;
        this._lastStep = STEP_NONE;
        this._timer = null;
        this._setStep(STEP_START);
    }
    /**
    * 接続先以外のメンバー変数のクリア
    * @private
    */
    _clearData(){
        this._requestStr=null;//base64 request
        this._resultData=null;
        this._responseStr=null;
        this._lastCommand=null;
        this._nakRetryCount=0;
        this._cmdRetryCount=0;//AP,AC retryCount
        this._cancelStatus=CancelStatus.none;//AC Status
    }
    /**
     * キャンセルリクエストの受付
     * @param step 
     */
    _requestCancel(){
        this._cancelStatus = CancelStatus.pending;
        log("Request Cancel Received.");
    }
    /**
     * 処理状況の記録
     * 処理状況に応じたタイムアウト制御などが行われます。
     * @param {int} step 処理番号 STEP_で始まる定数で定義されています。
     * @private
     */
    _setStep(step){
        this._step = step;
        switch(step){
        case STEP_START:          log("Start");          break;
        case STEP_PREPROCESS:     log("PreProcess");     break;
        case STEP_BUILDREQUEST:   log("Build request");  break;
        case STEP_COMMUNICATE:    log("Communicate");    break;
        case STEP_CONNECTED:      log("Connected");      break;
        case STEP_SENT_REQUEST:   log("Sent request");   break;
        case STEP_WAIT_ACK_NAK:   log("Wait Ack/Nak");   break;
        case STEP_WAIT_RESPONSE:  log("Wait Response");  break;
        case STEP_WAIT_SEND_AP:   log("Wait Send AP");   break;
        case STEP_RECEIVEDRESULT: log("Received Result");break;
        case STEP_PARSERESULT:    log("Parse Result");   break;
        case STEP_FINISHED:       log("Finished");       break;
        case STEP_ERRORFINISHED:  log("Error Finished"); break;
        default:                  log("Unknown Step");   break;
        }
    }
    /**
    * リクエストコマンドのヘッダ、データ部の組み立て
    * @param {String} dataType データ種別
    * @param {Object} dataObj データ部情報
    * @param {int} dataLen データ部バイト長
    * @param {Function} データ部生成用のコールバック
    * @private
    */
    _buildRequest(dataObj){
        this._setStep(STEP_BUILDREQUEST);
        if (dataObj.request == null){
            return false;
        }
        try {
            var req = JSON.stringify(dataObj.request);
            if (req == "{}")
                return false;
            this._requestStr = Base64Encode(req);
        } catch (e){
            error(e);
            return false;
        }
        return true;
    }
    /**
    * レスポンスデータ文字列の解析
    * @param {String} data 端末から受信したPayload文字列データ
    * @private
    */
    _parseResult(data){
        this._setStep(STEP_PARSERESULT);
        this._responseStr = data;
        log("Receive DataLength="+this._responseStr.length);
        try {
            var text = Base64Decode(this._responseStr.substring(6));
            this._resultData = JSON.parse(text);
        } catch (e){
            error(e.Message);
            return false;
        }
        return true;
    }
    /**
     * Parse Response Code.
     */
    _parseResponseCode(response){
        if (response == null||response.length < 6){
            return ResponseCodeType.unknown;
        }
        if (response.indexOf("0000AP") >= 0){
            return ResponseCodeType.completed;
        }
        if (response.indexOf("0000AC") >= 0){
            return ResponseCodeType.cancel_accepted;
        }
        if (response.indexOf("0001AC") >= 0){
            return ResponseCodeType.cancel_rejected;
        }
        if (response.indexOf("0001AP") >= 0){
            return ResponseCodeType.pending;
        }
        if (response.indexOf("0000A1") >= 0){
            return ResponseCodeType.request_accepted;
        }
        if (response.indexOf("A1") >= 0){
            return ResponseCodeType.request_rejected;
        }
        return ResponseCodeType.error;
    }
    /**
     * Clear Timer.
     */
    _clearTimer(){
        if (this._timer != null){
            clearTimeout(this._timer);
            this._timer = null;
        }
    }
    /**
     * Set Timer
     *  Wait to receive Ack/Nak.
     *  Wait to receive response.
     *  Wait to send AP/AC.
     * @param {int} timeout 
     * @param {*} callback 
     */
    _setTimer(timeout, callback){
        this._clearTimer();
        this._timer = setTimeout(callback.bind(this), timeout);
    }
    /**
     * send command (A1, AP, AC)
     */
    _sendLastCommand(timeout){
        try {
            log("Send ["+this._lastCommand+"]");
            this._client.send(this._lastCommand);
        } catch (e){
            error(e);
            return false;
        }
        this._setTimer(timeout, this._recvTimeout);
        return true;
    }
    /**
     * send A1 command.
     */
    _sendRequest(){
        this._lastCommand = "A1"+this._requestStr;
        if (this._sendLastCommand(TIMEOUT_ACK_NAK_A1)){
            this._setStep(STEP_WAIT_ACK_NAK);
        } else {
            this._client._onErrorFinished(new ErrorInfo(RESPONSE_CODE_DEVICE_ERROR, CAUSE_SEND_CMD));
        }
    }
    /**
     * send AP/AC
     *  端末からレスポンス受信後、500ms秒後にAPまたはAC送信
     */
    _sendPollingCommand(){
        var tout = TIMEOUT_ACK_NAK_AP;
        if (this._cancelStatus == CancelStatus.pending){
            this._lastCommand = "AC";
            tout = TIMEOUT_ACK_NAK_AC;
        } else {
            this._lastCommand = "AP";
            tout = TIMEOUT_ACK_NAK_AP;
        }
        if (this._sendLastCommand(tout)){
            this._setStep(STEP_WAIT_ACK_NAK);
        } else {
            if (this._lastCommand == "AC"){ 
                this._client._onErrorFinished(new ErrorInfo(RESPONSE_CODE_DEVICE_ERROR, CAUSE_SEND_AC));
            } else {
                this._client._onErrorFinished(new ErrorInfo(RESPONSE_CODE_DEVICE_ERROR, CAUSE_SEND_AP));
            }
        }
    }
    /**
     * wait to send polling command.
     */
    _waitToSendPollingCommand(){
        this._setStep(STEP_WAIT_SEND_AP);
        this._setTimer(TIMEOUT_AP, this._sendPollingCommand);
    }
    /**
     * wait to receive command.
     */
    _waitToReceiveCommand(){
        this._setStep(STEP_WAIT_RESPONSE);
        this._setTimer(TIMEOUT_RESPONSE, this._recvTimeout);
    }
    /**
     * send ack.
     *  wait next polling.
     */
    _sendAck(){
        try {
            log("Send [ACK]");
            this._client.send("ACK");
        } catch (e){
            error(e);
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_DEVICE_ERROR, CAUSE_SEND_ACK));
            return false;
        }
        this._nakRetryCount = 0;
        return true;
    }
    /**
     * send nak.
     *  wait next polling.
     */
    _sendNak(){
        if (this._nakRetryCount > MAX_NAK_RETRY){
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_INVALID_SEQUENCE, CAUSE_JSON_PARSE));
            return ;
        }
        this._nakRetryCount++;
        try {
            log("Send [NAK]");
            this._client.send("NAK");
        } catch (e){
            error(e);
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_DEVICE_ERROR, CAUSE_SEND_NAK));
            return false;
        }
        return true;
    }
    /**
     * Receive Timeout.
     *  wait ACK/NAK.
     *  wait response.
     */
    _recvTimeout(){
        if (this._step == STEP_WAIT_ACK_NAK){
            if (this._cmdRetryCount > MAX_POLLING_RETRY){
                this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_INVALID_SEQUENCE, CAUSE_CMD_RETRY_COUNT));
            } else {
                this._cmdRetryCount++;
                this._waitToSendPollingCommand();
            }
        } else {
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_INVALID_SEQUENCE, CAUSE_RES_TIMEOUT));
        }
    }
    /**
    * receive response. parse response and execute next action.
    * @param {Object} event WebSocket event data.
    * @private
    */
    _recvResponse(event){
        if (event.data == null){
            return ;
        }
        this._clearTimer();
        if (event.data.length == 3){
            log("Received [" + event.data + "]");
            if (event.data == ACK){
                //WAIT RESPONSE
                this._cmdRetryCount = 0;
                this._waitToReceiveCommand();
            } else if (event.data == NAK){
                //WAIT RETRY AP
                this._waitToSendPollingCommand();
            } else {
                //WAIT RETRY AP
                this._waitToSendPollingCommand();
            }
        } else {
            this._setStep(STEP_RECEIVEDRESULT);
            log("Received ["+event.data+"]");
            var ret = this._parseResponseCode(event.data);
            log("ResponseCodeType:"+ret);
            //0001AP
            if (ret == ResponseCodeType.pending||
                ret == ResponseCodeType.request_accepted){
                if (this._sendAck()){
                    this._waitToSendPollingCommand();
                }
            //0000AC
            } else if (ret == ResponseCodeType.cancel_accepted){
                this._cancelStatus = CancelStatus.accepted;
                if (this._sendAck()){
                    this._waitToSendPollingCommand();
                }
            //0001AC
            } else if (ret == ResponseCodeType.cancel_rejected){
                this._cancelStatus = CancelStatus.rejected;
                if (this._sendAck()){
                    this._waitToSendPollingCommand();
                }
            //0000AP
            } else if (ret == ResponseCodeType.completed){
                if (this._parseResult(event.data)){
                    if (this._sendAck()){
                        this._onFinished();
                    }
                } else {
                    if (this._sendNak()){
                        this._waitToReceiveCommand();
                    }
                }
            //XXXXAP
            } else if (ret == ResponseCodeType.error||
                       ret == ResponseCodeType.request_rejected){
                if (this._sendAck()){
                    this._onErrorFinished(new ErrorInfo(event.data.substring(0, 4), CAUSE_RES_CD_ERROR, false));
                }
            //Others.
            } else {
                if (this._sendNak()){
                    this._waitToReceiveCommand();
                }
            }
        }
    }
    /**
     * clear interval.
     */
    _clearInterval(){
        if (this._intervalId != null){
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }
    /**
    * complete. 
    * @private
    */
    _onFinished(){
        this._clearTimer();
        if (this._resultData == null){
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_INVALID_SEQUENCE, CAUSE_JSON_PARSE));
            return ;
        }
        this._setStep(STEP_FINISHED);
        if (this._listener != null){
            this._listener.postMessage(this._resultData);
            this._clearInterval();
        }
        if (this._client != null){
            this._client.close();
            this._client = null;
            cls = null;
        }
    }
    /**
    * error.
    * @private
    */
    _onErrorFinished(errorInfo){
        this._clearTimer();
        this._setStep(STEP_ERRORFINISHED);
        if (this._client != null){
            this._client.close();
            this._client = null;
            cls = null;
        }
        if (this._listener == null){
            error(JSON.stringify(errorInfo._resultData));
            return ;
        }
        this._listener.postMessage(errorInfo._resultData);
        this._clearInterval();
    }
    /**
     * before connecting
     * @param {Worker} listener result listener (postMessage)
     * @private
     */
    _preProcess(listener){
        this._setStep(STEP_PREPROCESS);
        this._clearData();
        this._listener   = listener;
        if (this._client != null){
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_PROCESSING, CAUSE_DEVICE_BUSY));
            return false;
        }
        return true;
    }
    /**
     * callback: communication error
     * @param {Object} event callback notification.
     * @private
     */
    _communicateError(event){
        log('Sockt Error:'+event);
        //強制切断後のエラー通知の場合、再通知を行わない
        if (this._client != null){
            if (this._step == STEP_RECONNECT){
                this._client.close();
                return ;
            }
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_DEVICE_ERROR, CAUSE_NET_ERROR));
        }
    }
    /**
     * callback: network down.
     * @param {Object} event callback notification.
     * @private
     */
    _communicateClose(event){
        log('Socket Closed:'+event);
        if (this._client != null){
            if (this._step != STEP_FINISHED&&
                this._step != STEP_ERRORFINISHED){
                if (this._lastCommand == "AC"||this._cancelStatus == CancelStatus.pending){
                    log("Force Canceled");
                    this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_CANCEL, CAUSE_POS_FORCE_CANCEL));
                    return ;
                }
                if (this._lastCommand == "AP"){
                    log("Wait reconnect..");
                    this._setTimer(TIMEOUT_RECONNECT, this._recommunicate);
                    return ;
                }
            }
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_DEVICE_ERROR, CAUSE_NET_DOWN));
        }
    }

    /**
     * Start Socket reconnection, send AP.
     * @private
     */
    _recommunicate(){
        this._setStep(STEP_RECONNECT);
        var dest="";
        if (this._host.startsWith('wss')||this._host.startsWith('ws')){
          dest = this._host;
        } else {
          dest = "ws://"+this._host+":"+this._port;
        }
        log('Connect to '+dest);
        this._client = new WebSocket(dest);
        this._client.onopen = function(event){
            this._setStep(STEP_CONNECTED);
            this._waitToSendPollingCommand();
        }.bind(this);
        this._client.onerror   = this._communicateError.bind(this);
        this._client.onmessage = this._recvResponse.bind(this);
        this._client.onclose   = this._communicateClose.bind(this);
    }

    /**
     * Start Socket connection, send request.
     * @private
     */
    _communicate(){
        this._setStep(STEP_COMMUNICATE);
        var dest="";
        if (this._host.startsWith('wss')||this._host.startsWith('ws')){
          dest = this._host;
        } else {
          dest = "ws://"+this._host+":"+this._port;
        }
        log('Connect to '+dest);
        this._client = new WebSocket(dest);
        this._client.onopen = function(event){
            this._setStep(STEP_CONNECTED);
            this._sendRequest();
        }.bind(this);
        this._client.onerror   = this._communicateError.bind(this);
        this._client.onmessage = this._recvResponse.bind(this);
        this._client.onclose   = this._communicateClose.bind(this);
    }
    /**
     * check timeout for network connection.
     * @private
     */
    _checkProcessing(){
        if (this._lastStep != this._step){
            this._lastStepTimestamp = Date.now();
            this._lastStep = this._step;
            return ;
        }
        if (this._step > STEP_CONNECTED){
            this._clearInterval();
            return ;
        }
        var sec = (Date.now() - this._lastStepTimestamp);
        var timeout=false;
        var errorCode=CAUSE_CONNECTION;
        switch(this._step){
        case STEP_START:        timeout = sec > TIMEOUT_PREPROCESS;     break;
        case STEP_PREPROCESS:   timeout = sec > TIMEOUT_BUILDREQUEST;   break;
        case STEP_BUILDREQUEST: timeout = sec > TIMEOUT_COMMUNICATE;    break;
        case STEP_COMMUNICATE:  timeout = sec > TIMEOUT_CONNECTED;      errorCode=CAUSE_CONNECTION; break;
        case STEP_CONNECTED:    timeout = sec > TIMEOUT_ACK_NAK_A1;     errorCode=CAUSE_SEND_CMD;
                                this._clearInterval();
                                break;
        }
        if (timeout){
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_DEVICE_ERROR, errorCode));
        }

    }
    /**
     * start transaction.
     * @param {Object} requestData  request JSON
     * @param {Function} listener result listener (postMessage capability)
     * @public
     */
    doRequest(requestData, listener){
        if (!this._preProcess(listener)){
            return ;
        }
        if (this._buildRequest(requestData)){
            this._communicate();
        } else {
            this._onErrorFinished(new ErrorInfo(RESPONSE_CODE_INVALID_PARAMETER, CAUSE_CMD_FORMAT));
        }
    }
}
/**
 * duplicate start check
 * @return {Boolean} true: acceptable false: not acceptable
 * @public
 */
function isAcceptable(){
    if (cls == null)
        return true;
    return false;
}
/**
 * Interface for Web Worker.
 * @param {Object} event
 * @public
 */
self.onmessage = function(event){
    if (event.data == null||event.data.length < 1){
        self.postMessage(new ErrorInfo(RESPONSE_CODE_UNDEFINED, CAUSE_CMD_FORMAT)._resultData);
        return ;
    }
    if (!isAcceptable()){
        if (event.data.request["Cancel"]){
            cls._requestCancel();
            return ;
        }
        self.postMessage(new ErrorInfo(RESPONSE_CODE_PROCESSING, CAUSE_DEVICE_BUSY)._resultData);
        return ;
    } else {
        if (event.data.request["Cancel"]){
            self.postMessage(new ErrorInfo(RESPONSE_CODE_INVALID_SEQUENCE, CAUSE_CMD_SEQ_ERR)._resultData);
            return ;
        }
    }
    cls = new VescaJSFullFeaturedWS(event.data.host, event.data.port);
    cls.doRequest(event.data, self);
}
