import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import {CouponService} from './coupon.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { PaymentService } from './payment.service';
import { CashService } from './cash.service';
import { ActivatedRoute} from '@angular/router';
import { environment } from '../../environments/environment';

import { Router } from '@angular/router';

// 印刷サービス。

declare var epson: any;

const headers = new HttpHeaders({
  'x-api-key': environment.apiToken,
});

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private cartService: CartService, public paymentService: PaymentService, public http: HttpClient, public storage: Storage, public router: Router, public cashService: CashService, public activeRoute: ActivatedRoute, public couponService: CouponService) {}

  ipAddress = null;
  port      = null;
  deviceID  = null;

  crypto = false;
  buffer = false;

  printer = null;
  kitchenPrinter = null;

  isPrinterConnected = false;
  isKitchenPrinterConnected = false;
  isCashChangerConnected = false;
  readValue = false;

  nowDate: string;
  nowTime: string;
  date1: Date;
  month1: any;
  day1: any;
  hours1: any;
  minutes1: any;
  youbi =  ['日', '月', '火', '水', '木', '金', '土', ];
  buyTypeJa: string;
  taxPercent: string;

  cart = [];
  cartCoupon = [];
  category: any;

  cartPriceSorted = [];

  totalTax = 0;
  printerNumString: any;
  serialNumString: any;
  todayStorage: any;
  todayString: any;

  receiptNumber: any;
  priceLength: number;
  priceAndAmountLength: number;
  subTotal: number;
  subTotalLength: number;
  subTotalString: string;
  taxableMethod: number;
  totalPrice01 = 0;
  totalPrice02 = 0;
  context: any;
  contextFooter: any;
  canvas: any;
  canvasFooter: any;

  exReadValue: number;

  cashchanger = null;

  sample = '';

  ePosDev = new epson.ePOSDevice();
  ePosDev2 = new epson.ePOSDevice();
  xhr = new XMLHttpRequest();
  receiptJson: any;

  alertMessage: any;


  getCanvas(){
    return new Promise( (resolve) => {
      this.canvas = document.getElementById('canvas')as HTMLCanvasElement;
      console.log('this.canvas:' + this.canvas);
      // this.context = this.canvas.getContext('2d');

      const image1 = new Image();
      image1.crossOrigin = 'Anonymous';
      // image.src = '../../assets/image/logoipsum.png';
      // image1.src = '../../assets/image/logoipsum.png';
      image1.src = this.receiptJson[0].Logo;

      image1.addEventListener('load', async () => {

        console.log('image1:' + image1);
        resolve(image1);

        this.canvas.width = image1.width;
        this.canvas.height = image1.height;
        console.log('image.width' + image1.width);
        console.log(typeof(image1.width));
        console.log('canvas.width' + this.canvas.width);
        console.log(typeof(this.canvas.width));

        this.context = await this.canvas.getContext('2d');

        await this.context.drawImage(image1, 0, 0);
      }, false);

      this.context = this.canvas.getContext('2d');

      console.log('getCanvas()1:' + this.context);

      console.log('this.canvas.width within getCanvas():' + this.canvas.width);

    });
  }
  
  getCanvasFooter(){
    return new Promise ( (resolve) => {

      this.canvasFooter = document.getElementById('canvasFooter')as HTMLCanvasElement;
      console.log('this.canvas:' + this.canvasFooter);
      // this.context = this.canvas.getContext('2d');
  
      const image2 = new Image();
      image2.crossOrigin = 'Anonymous';
      // image.src = '../../assets/image/logoipsum.png';
      // image2.src = '../../assets/image/loremipsumQR.jpg';
      image2.src = this.receiptJson[0].footerImage;
  
      image2.addEventListener('load', async () => {
  
        console.log('image2:' + image2);
        resolve(image2);
  
        this.canvasFooter.width = image2.width;
        this.canvasFooter.height = image2.height;
        console.log('image.width' + image2.width);
        console.log(typeof(image2.width));
        console.log('canvasFooter.width' + this.canvasFooter.width);
        console.log(typeof(this.canvasFooter.width));
  
        this.contextFooter = await this.canvasFooter.getContext('2d');
  
        await this.contextFooter.drawImage(image2, 0, 0);
      }, false);
  
      this.contextFooter = this.canvasFooter.getContext('2d');
  
  
      console.log('getCanvasFooter()1:' + this.contextFooter);
  
      console.log('this.canvasFooter.width within getCanvas():' + this.canvasFooter.width);
  
    });
  }



  onSetClick(key, nextNum){
    console.log('onSetClick() called ');
    return new Promise( resolve => {
      this.storage.set(key, nextNum);
      resolve();
    });
  }

  onGetClick(key){
    console.log('onGetClick() called');
    return new Promise(resolve => {
      this.storage.get(key).then(data => {
        resolve(data);
        console.log('onGetClick:' + data);
      },
      err => {
        console.log(err);
      });
    });
  }

  getReceiptJson = () => {
    return new Promise(resolve => {
      this.http.get(environment.apiUrl + '/receipt', {headers}).subscribe(data => {
      resolve(data); },
      err => {
      console.log(err);
      });
    });
  }

  setLocalPrinter(){
    this.ipAddress = '127.0.0.1';
    this.port = 8008;
    this.deviceID = 'local_printer';
    console.log('local var set');

  }

  async setKitchenPrinter(){
    this.ipAddress = await this.onGetClick('kitchenPrinterIP');
    // this.ipAddress = '192.168.1.207';
    this.port = 8008;
    this.deviceID = 'kp01';
    // console.log('kitchen var set' + this.ipAddress + ',' + this.port + ':' + this.deviceID);

    // console.log('printer var set2' + this.ipAddress + ',' + this.port + ':' + this.deviceID);

    console.log('ePosDev1:' + this.ePosDev);

    this.ePosDev.createDevice(this.deviceID, this.ePosDev.DEVICE_TYPE_PRINTER, {'crypto' : false, 'buffer' : false}, this.callbackCreateDevice_printer);

    // this.connect();
  }

  // async setCashChanger(){
  //   this.ipAddress = '127.0.0.1';
  //   this.port = 8008;
  //   this.deviceID = 'CashChanger';
  //   this.ePosDev.createDevice(this.deviceID, this.ePosDev.DEVICE_TYPE_PRINTER, {'crypto' : false, 'buffer' : false}, this.callbackCreateDevice_printer);
  // }

  sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

  connect = async () => {
      console.log('printer var set' + this.ipAddress + ',' + this.port + ':' + this.deviceID);

      // if (this.deviceID === 'local_printer'){
      await this.ePosDev.connect(this.ipAddress, this.port, this.Callback_connect);
      // } else if (this.deviceID === 'kp01'){
      //   await this.ePosDev2.connect(this.ipAddress, this.port, this.Callback_connect);

      // }
      console.log('after connect');

      this.ePosDev.onreconnecting = this.OnReconnecting;
      this.ePosDev.onreconnect = this.OnReconnect;
      this.ePosDev.ondisconnect = this.OnDisconnect;

  }

  Callback_connect  = (data) => {
    // return new Promise(async resolve => {
      // const deviceID = 'local_printer';
      const options  = {'crypto' : false, 'buffer' : false};
  
      if (data === 'OK') {
        // if (this.deviceID === 'local_printer'){
        console.log("connected to ePOS Device Service Interface.");
        this.ePosDev.createDevice(this.deviceID, this.ePosDev.DEVICE_TYPE_PRINTER, options, this.callbackCreateDevice_printer);
        // } else if (this.deviceID === 'kp01'){
        //   console.log("connected to ePOS Device2 Service Interface.");
        //   this.ePosDev2.createDevice(this.deviceID, this.ePosDev2.DEVICE_TYPE_PRINTER, options, this.callbackCreateDevice_printer);
        // }
  

        console.log('data' + data);
        console.log('deviceID' + this.deviceID);
        // resolve('ok');
      }
      else if (data === 'SSL_CONNECT_OK') {
        console.log("connected to ePOS Device Service Interface with SSL.", true);
        this.ePosDev.createDevice(this.deviceID, this.ePosDev.DEVICE_TYPE_PRINTER, options, this.callbackCreateDevice_printer);
        // resolve('ok');
      }
      else {
        console.log("connected to ePOS Device Service Interface is failed. [" + data + "]", true);
      }
  

    // });
  }



  callbackCreateDevice_printer = async (data) => {
    // return new Promise (resolve => {
      if (data === null) {
        console.log('error');
        console.log('createdeviceerror:' + data);
        return;
      }
  
      if (this.deviceID === 'local_printer'){
        console.log("you can use printer.");
        this.printer = data;
        this.isPrinterConnected = true;
        this.printer.onstatuschange = this.onStatusUpdatePrinter;
        this.printer.onpapernearend = () =>{
          let message = '(プリンター)まもなく用紙切れです。';
          console.log(message);
          const url = location.pathname;
          if (url === '/settings'){
            document.getElementById('status-printer').innerHTML = message;
          } 
          // else {
          //   message = this.printerNumString + '番レジ \n' + message;
          //   console.log('this.printerNumString' + this.printerNumString);
          //   this.alertToKitchen(message);
          // }
        };

        this.printer.onpaperrend = () =>{
          let message = '(プリンター)用紙切れです。';
          console.log(message);
          const url = location.pathname;
          if (url === '/settings'){
            document.getElementById('status-printer').innerHTML = message;
          }
          //  else {
          //   message = this.printerNumString + '番レジ \n' + message;
          //   console.log('this.printerNumString' + this.printerNumString);
          //   this.alertToKitchen(message);
          // }
        };



        // for Test
        console.log('data' + data);
        console.log('typeof data' + typeof(data));

        this.printer.ononline = () => {
          console.log('printer online!!');
        };

        this.printer.onoffline = () => {
          console.log('printer offline!!');
        };



        this.printer.onreceive = async (res) => {
          console.log('Print' + (res.success ? 'Success' : 'Failure') + '\nCode:' + res.code + '\nBattery:' + res.battery + '\n' + this.alertStatusPrinter(this.printer, res.status), true);

          // this.cashService.ReadCashCounts();
          const sEmpty = await this.onGetClick('sEmpty');
          const sNearEmpty = await this.onGetClick('sNearEmpty');
          console.log(JSON.stringify('sEmpty' + sEmpty));
          console.log(JSON.stringify('sNearEmpty' + sNearEmpty));
          if (sEmpty) {this.alertToKitchen(sEmpty); }
          if (sNearEmpty) {this.alertToKitchen(sNearEmpty); }
          // if (sEmpty) { this.alertToKitchen }
          // this.printer.startMonitar();

        };

        this.printer.startMonitor();

        this.setKitchenPrinter();

  
      }else if (this.deviceID === 'kp01'){
        console.log("you can use kitchen printer.");
        this.kitchenPrinter = data;
        this.isKitchenPrinterConnected = true;



        this.kitchenPrinter.onreceive = (res) => {
          console.log('Kitchen Print' + (res.success ? 'Success' : 'Failure') + '\nCode:' + res.code + '\nBattery:' + res.battery + '\n' + this.getStatusText(this.kitchenPrinter, res.status), true);
          if (res.success){
          }
        };

        this.ePosDev.createDevice('CashChanger', this.ePosDev.DEVICE_TYPE_CASH_CHANGER, {'crypto' : false, 'buffer' : false}, this.callbackCreateDevice_cashchanger);
  
      }
  }

  callbackCreateDevice_cashchanger = (data, code) => {
    if (data != null) {
      this.cashchanger = data;
      console.log("you can use cashchanger.");
      this.isCashChangerConnected = true;
      // this.cashchanger.onstatuschange = this.onStatusChange;
      this.cashchanger.onstatusupdate = this.onStatusUpdate;
      this.cashchanger.ondirectio = this.onDirectIO;
      this.cashService.setCashChanger(this.cashchanger);
      console.log('cashchanger' + this.cashService.cashchanger);
      // console.log('cashchangerString' + JSON.stringify(data.SUE_STATUS_NEAREMPTY));
      console.log('cashchangerString2' + (data.SUE_STATUS_NEAREMPTY));
      console.log('cashchangerString3' + (data.SUE_STATUS_EMPTY));
      console.log('cashchangerString4' + (data.SUE_STATUS_NEARFULL));
      this.cashService.ReadCashCounts();
      // this.cashService.SendDirectIOCommand();


    }
    else {
      console.log(code);
      console.log('data:' + data);
    }
  }

  onDirectIO(data) {
    console.log("eventnumber: " + data.eventnumber);
    console.log("data: " + data.data);
    console.log("string: " + data.string);
  }


  onStatusUpdate = (data) => {
    console.log('statusUpdate!!!: ' + this.getCashStatusText(this.cashchanger, data.status));
  }

  getCashStatusText = (e, status) => {
    var s;
    // let msg;
    switch (status){
      case e.SUE_POWER_ONLINE:
        s = "SUE_POWER_ONLINE";
        break;
      case e.SUE_POWER_OFF:
        s = "SUE_POWER_OFF";
        document.getElementById('status-cash').innerHTML = '（釣銭機）電源オフまたは本体に接続されていません。';
        break;
      case e.SUE_POWER_OFFLINE:
        s = "SUE_POWER_OFFLINE";
        document.getElementById('status-cash').innerHTML = '（釣銭機）電源オンですが、ノットレディ状態です。';
        break;
      case e.SUE_POWER_OFF_OFFLINE:
        s = "SUE_POWER_OFF_OFFLINE";
        document.getElementById('status-cash').innerHTML = '（釣銭機）電源オフで、ノットレディ状態です。';
        break;
      case e.SUE_STATUS_EMPTY:
        s = "SUE_STATUS_EMPTY";
        // this.alertMessage = 'エンプティの金種があります。';
        // this.alertToKitchen(this.alertMessage);
        document.getElementById('status-cash').innerHTML = '（釣銭機）エンプティの金種があります。';
        break;
      case e.SUE_STATUS_NEAREMPTY:
        s = "SUE_STATUS_NEAREMPTY";
        // this.alertMessage = 'ニアエンプティの金種があります。';
        // console.log('e' + JSON.stringify(e));
        // console.log('status' + status);
        document.getElementById('status-cash').innerHTML = '（釣銭機）ニアエンプティの金種があります。';
        // this.alertToKitchen(this.alertMessage);
        break;
      case e.SUE_STATUS_EMPTYOK:
        s = "SUE_STATUS_EMPTYOK";
        break;
      case e.SUE_STATUS_FULL:
        s = "SUE_STATUS_FULL";
        // this.alertMessage = 'フルの金種があります。';
        // this.alertToKitchen(this.alertMessage);
        document.getElementById('status-cash').innerHTML = '（釣銭機）フルの金種があります。';
        break;
      case e.SUE_STATUS_NEARFULL:
        s = "SUE_STATUS_NEARFULL";
        // this.alertMessage = 'ニアフルの金種があります。';
        // this.alertToKitchen(this.alertMessage);
        document.getElementById('status-cash').innerHTML = '（釣銭機）ニアフルの金種があります。';
        break;
      case e.SUE_STATUS_FULLOK:
        s = "SUE_STATUS_FULLOK";
        break;
      case e.SUE_STATUS_JAM:
        s = "SUE_STATUS_JAM";
        document.getElementById('status-cash').innerHTML = '（釣銭機）機器障害が生じました。';
        break;
      case e.SUE_STATUS_JAMOK:
        s = "SUE_STATUS_JAMOK";
        break;
      default:
        s = status;
        break;
    }

    return s;
  }

  alertToKitchen = (msg) => {
    this.kitchenPrinter.addTextLang('ja');
    this.kitchenPrinter.addTextAlign(this.kitchenPrinter.ALIGN_LEFT);

    this.kitchenPrinter.addText(msg + '\n');
    this.kitchenPrinter.addText('\n\n\n');

    this.kitchenPrinter.addCut(this.kitchenPrinter.CUT_FEED);
    this.kitchenPrinter.send();
  }


  onStatusChange = (data) => {
    let string = '';
    string = "status: " + data.status + "\r\n";
    string += "st10000: " + data.st10000 + "\t";
    string += "st5000: " + data.st5000 + "\t";
    string += "st2000: " + data.st2000 + "\t";
    string += "st1000: " + data.st1000 + "\t";
    string += "st500: " + data.st500 + "\r\n";
    string += "st100: " + data.st100 + "\t";
    string += "st50: " + data.st50 + "\t";
    string += "st10: " + data.st10 + "\t";
    string += "st5: " + data.st5 + "\t";
    string += "st1: " + data.st1 + "\r\n";
    console.log(string);
  }



  OnReconnecting() {
    console.log('onreconnecting');
  }

  OnReconnect() {
    console.log('onreconnect');
  }

  OnDisconnect() {
    console.log('ondisconnect');
  }

  consolelog(string, option?) {
    var length = arguments.length;
    var overwrite = length > 1 ? option : false;
    
    if (overwrite) {
      (document.getElementById("console") as HTMLInputElement).value = string + "\r\n";
    } else {
      (document.getElementById("console") as HTMLInputElement).value += string + "\r\n";
    }
  }

  onStatusUpdatePrinter = (data) => {
    console.log('statusUpdatePrinter: ' + this.getStatusText(this.printer, data.status));
  }

  // onPaperNearEnd = (data) =>{
  //   console.log('paperNearEnd:' + JSON.stringify(data));
  //   console.log('paperNearEnd:' + data);

  // }

  alertStatusPrinter = (e, status) => {
    let s = 'AlertStatus: \n';
    let msg;
    if (status & e.ASB_RECEIPT_END) {
      s += ' No paper in the roll paper end detector\n';
      if (e === this.printer){
        msg = 'プリンターの用紙が空です。';
        msg = this.printerNumString + '番レジ \n' + msg;
        this.alertToKitchen(msg);
        console.log(msg);
      }
      // document.getElementById('status-printer').innerHTML = '(プリンター)用紙がなくなりました。';
    } else if (status & e.ASB_RECEIPT_NEAR_END) {
      s += ' No paper in the roll paper near end detector\n';
      if (e === this.printer){
        msg = 'プリンターがまもなく用紙切れです。';
        msg = this.printerNumString + '番レジ \n' + msg;
        this.alertToKitchen(msg);
        console.log(msg);
      }
      // document.getElementById('status-printer').innerHTML = '(プリンター)まもなく用紙切れが発生します。';

    }

    return s;
  }

  getStatusText = (e, status) => {
    let s = 'Status: \n';
    // let msg;
    if (status & e.ASB_NO_RESPONSE) {
      s += ' No printer response\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)プリンター応答がありません。';
    }
    if (status & e.ASB_PRINT_SUCCESS) {
      s += ' Print complete\n';
    }
    if (status & e.ASB_DRAWER_KICK) {
      s += ' Status of the drawer kick number 3 connector pin = "H"\n';
    }
    if (status & e.ASB_OFF_LINE) {
      s += ' Offline status\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)オフラインです。';

    }
    if (status & e.ASB_COVER_OPEN) {
      s += ' Cover is open\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)カバーが開いています。';

    }
    if (status & e.ASB_PAPER_FEED) {
      s += ' Paper feed switch is feeding paper\n';
    }
    if (status & e.ASB_WAIT_ON_LINE) {
      s += ' Waiting for online recovery\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)オンラインになるまで待機しています。';
    }
    if (status & e.ASB_PANEL_SWITCH) {
      s += ' Panel switch is ON\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)パネルスイッチがオンになっています。';
    }
    if (status & e.ASB_MECHANICAL_ERR) {
      s += ' Mechanical error generated\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)メカニカルエラーが発生しました。';
    }
    if (status & e.ASB_AUTOCUTTER_ERR) {
      s += ' Auto cutter error generated\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)カットエラーが発生しました。';

    }
    if (status & e.ASB_UNRECOVER_ERR) {
      s += ' Unrecoverable error generated\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)復帰不可能エラー発生あり';

    }
    if (status & e.ASB_AUTORECOVER_ERR) {
      s += ' Auto recovery error generated\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)自動復帰可能エラー発生あり';

    }
    if (status & e.ASB_RECEIPT_NEAR_END) {
      s += ' No paper in the roll paper near end detector\n';
      // if (e === this.printer){
      //   msg = 'プリンターがまもなく用紙切れです。';
      //   this.alertToKitchen(msg);
      // }
      document.getElementById('status-printer').innerHTML = '(プリンター)まもなく用紙切れが発生します。';

    }
    if (status & e.ASB_RECEIPT_END) {
      s += ' No paper in the roll paper end detector\n';
      // if (e === this.printer){
      //   msg = 'プリンターが用紙切れです。';
      //   this.alertToKitchen(msg);
      // }
      document.getElementById('status-printer').innerHTML = '(プリンター)用紙がなくなりました。';


    }
    if (status & e.ASB_BUZZER) {
      s += ' Sounding the buzzer (certain model)\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)バザーが鳴っています。';

    }
    if (status & e.ASB_SPOOLER_IS_STOPPED) {
      s += ' Stop the spooler\n';
      document.getElementById('status-printer').innerHTML = '(プリンター)印刷スプーラーが停止されました。';

    }
    return s;
  }





  // printTestfunctions

  getDate(){
    this.date1 = new Date();
    this.month1 = (this.date1.getMonth() + 1)  < 10 ? '0' + (this.date1.getMonth() + 1) : (this.date1.getMonth() + 1);
    this.day1 = this.date1.getDate() < 10 ? '0' + this.date1.getDate() : this.date1.getDate();
    this.hours1 = this.date1.getHours() < 10 ? '0' + this.date1.getHours() : this.date1.getHours();
    this.minutes1 = this.date1.getMinutes() < 10 ? '0' + this.date1.getMinutes() : this.date1.getMinutes();


    this.nowDate = this.date1.getFullYear() + '年' + this.month1 + '月' + this.day1 + '日' + '(' + this.youbi[this.date1.getDay()] + ')';
    this.nowTime = this.hours1 + ':' + this.minutes1;
  }

  setBuyType(){
    if (this.cartService.getBuyType() === 'takeout'){
      this.buyTypeJa = 'お持ち帰り';
      this.taxPercent = '8%対象計';
    }else{
      this.buyTypeJa = '店内';
      this.taxPercent = '10%対象計';
    }
  }

  getTotal(){
    if (this.cartService.getBuyType() === 'takeout'){
      return this.cart.reduce((i, j) => i + j.price02 * j.amount, 0);
    } else{
      return this.cart.reduce((i, j) => i + j.price01 * j.amount, 0);
    }
  }

  // getTotalMinusCoupon(){
  //   this.cartCoupon = this.couponService.getCartCoupon();
  //   let totalMinusCoupon:any = this.getTotal();

  //   this.cartCoupon.map((coupon) =>{
  //     if(this.isCouponMatched(coupon)){
  //       totalMinusCoupon -= (coupon.discount_price * coupon.amount);
  //       console.log('totalMinusCoupon'+ totalMinusCoupon)
  //     }
  //   })
  //   if(totalMinusCoupon<0) totalMinusCoupon=0;
  //   return totalMinusCoupon

  // }

  getTotalMinusCoupon(){
    let totalMinusCoupon = 0;
    // let totalMinusCoupon = this.getTotal();
    this.cartPriceSorted = this.cartService.getCartPriceSorted();

    // if(this.cartCoupon.length === 0){
    //   this.cartPriceSorted.map(item =>{
    //     item.subtotal = this.cartService.getBuyType() === 'takeout'? item.price02 * item.amount : item.price01 * item.amount;
    //     item.discount_price = 0;
    //   })
    // }
    
    // this.cartCoupon.map((coupon) => {
    //   let totalDiscountPrice = coupon.discount_price * coupon.amount;
    //   this.cartPriceSorted.map(item =>{
    //     if(coupon.target.includes(item.id)){
    //       if(this.cartService.getBuyType() === 'takeout'){
    //         if(coupon.is_single === true &&  totalDiscountPrice >= item.price02){
    //           let subtotal = (item.price02 * item.amount) - item.price02;
    //           item.discount_price = item.price02;
    //           totalDiscountPrice = 0
    //           item.subtotal = subtotal;
    //         }else{
    //           let subtotal = (item.price02 * item.amount) - totalDiscountPrice
    //           if(subtotal < 0){
    //             totalDiscountPrice = -subtotal
    //             item.subtotal = 0
    //             item.discount_price = item.price02 * item.amount
    //           }else{
    //             item.discount_price = totalDiscountPrice;
    //             totalDiscountPrice = 0;
    //             item.subtotal = subtotal;
    //           }
    //         }
    //       }else{
    //         if(coupon.is_single === true &&  totalDiscountPrice >= item.price01){
    //           let subtotal = (item.price01 * item.amount) - item.price01;
    //           item.discount_price = item.price01;
    //           totalDiscountPrice = 0
    //           item.subtotal = subtotal;
    //         }else{
    //           let subtotal = (item.price01 * item.amount) - totalDiscountPrice
    //           if(subtotal < 0){
    //             totalDiscountPrice = -subtotal
    //             item.subtotal = 0
    //             item.discount_price = item.price02 * item.amount
    //           }else{
    //             item.discount_price = totalDiscountPrice;
    //             totalDiscountPrice = 0;
    //             item.subtotal = subtotal;

    //           }
    //         }
    //       }
    //     }else{
    //       item.discount_price = 0
    //       item.subtotal = this.cartService.getBuyType() === 'takeout'? item.price02 * item.amount : item.price01 * item.amount
    //     }
    //   })
    //   console.log('totalMinusCoupon'+ totalMinusCoupon)
      
    // })
    // if(totalMinusCoupon<0) totalMinusCoupon=0;
    // console.log('minusCoupon!!!');
    console.log('cartPriceSorted:' + JSON.stringify(this.cartPriceSorted));

    this.cartPriceSorted.map(item => {
      totalMinusCoupon += item.subtotal;
    })
    return totalMinusCoupon    
  }


  isCouponMatched = (coupon) =>{
    if(coupon.target === 'all' && this.cart.length !== 0){
        return true;
    }
    let couponMatched = 0;
    for(var i=0; i< this.cart.length; i++){
        if(coupon.target.includes(this.cart[i].id)){
        couponMatched += 1;
        }
    }
    console.log('couponMatched'+ couponMatched);
    if(couponMatched>=1){
        return true;
    }else{
        return false;
    }
    
  }




  // getTotalWithTax() {
  //   let totalMinusCoupon = this.getTotalMinusCoupon();
  //   if (this.cartService.getBuyType() === 'takeout') {
  //     return Math.floor(totalMinusCoupon * ((this.cart[0].taxRate02 * 0.01) + 1));
  //     // return this.cart.reduce((i, j) => i + (j.price02 * j.amount + j.tax02 * j.amount), 0);
  //   }else {
  //     return Math.floor(totalMinusCoupon * ((this.cart[0].taxRate01 * 0.01) + 1));
  //     // return this.cart.reduce((i, j) => i + (j.price01 * j.amount + j.tax01 * j.amount), 0);
  //   }
  // }

  getTotalWithTax(){
    this.cartPriceSorted = this.cartService.getCartPriceSorted();
    console.log('this.getTotalMinusCoupon6:' + this.getTotalMinusCoupon);
    let totalWithTax = 0;
    if (this.cartService.getBuyType() === 'takeout'){
      this.cartPriceSorted.map(item => {
          totalWithTax += Math.floor(item.subtotal * (item.taxRate02 * 0.01 + 1));
      });
    }else{
      this.cartPriceSorted.map(item => {
          totalWithTax += Math.floor(item.subtotal * (item.taxRate01 * 0.01 + 1));
      });
    }
    totalWithTax = Math.floor(totalWithTax);
    console.log('totalWithTax1:' + totalWithTax);
    return totalWithTax;
  }







  async receiptDesign(){

    // const headerUrl = '../../assets/image/logoipsum.png';
    // const headerId = 'canvas';
    this.receiptJson = await this.getReceiptJson();

    await this.getCanvas().then(res => console.log('res1:' + res));
    // this.canvas = document.getElementById('canvas')as HTMLCanvasElement;
    // this.context = await this.canvas.getContext('2d');

    console.log('contextTest:' + this.context);
    console.log('this.canvas.width1:' + this.canvas.width);

    this.getDate();
    this.setBuyType();
    this.cart = this.cartService.getCart();
    this.cartCoupon = this.couponService.getCartCoupon();
    this.category = await this.cartService.getCategory();


    const totalPayment = this.getTotal().toLocaleString();
    const totalPaymentWithTax = this.getTotalWithTax().toLocaleString();

    console.log('totalPaymentWithTax1:' + totalPaymentWithTax);
    // const receiptJson = await this.getReceiptJson();
    this.printerNumString = await this.onGetClick('printerNum');
    // this.serialNumString = await this.onGetClick('serialNum');
    this.todayStorage = await this.onGetClick('todayStorage');

    this.todayString = String(this.month1) + String(this.day1);


    if (this.todayStorage !== this.todayString){
      await this.onSetClick('serialNum', '0001');
      await this.onSetClick('todayStorage', this.todayString);
      console.log('if not equal');
    }
    
    this.serialNumString = await this.onGetClick('serialNum');
    this.todayStorage = await this.onGetClick('todayStorage');



    console.log('printerNumString:' + this.printerNumString);
    console.log('serialNumString:' + this.serialNumString);
    console.log('todayStorage:' + this.todayStorage);


    this.printer.addTextLang('ja');

    this.printer.addTextAlign(this.printer.ALIGN_CENTER);
    this.printer.brightness = 1;
    this.printer.halftone = this.printer.HALFTONE_DITHER;
    console.log('addImage.');
    // await this.printer.addImage(this.context, 0, 0, this.canvas.width, this.canvas.height, this.printer.COLOR_1, this.printer.MODE_MONO);
    this.printer.addImage(this.context, 0, 0, this.canvas.width, this.canvas.height, this.printer.COLOR_1, this.printer.MODE_MONO);
    this.printer.addTextAlign(this.printer.ALIGN_LEFT);

    this.printer.addText(this.receiptJson[0].shopName + '\n');
    this.printer.addText(this.receiptJson[0].shopAddress + '\n');
    this.printer.addText(this.receiptJson[0].telephone + '\n');

    // const textList = ['Text1', 'Text2', 'Text3', 'Text4', 'Text5'];

    // for (const key in textList){
    //   if (receiptJson[0].key !== ''){
    //     this.printer.addText(receiptJson[0].key + '\n');
    //   }
    // }

    for (let i = 1; i < 6; i++){
      const textKey = 'Text' + i;
      if (this.receiptJson[0][textKey] !== '' && this.receiptJson[0][textKey] !== null){
        this.printer.addText(this.receiptJson[0][textKey] + '\n');
      }
    }

    // console.log('Text Test:' + receiptJson[0]['Text2']);



    this.printer.addTextAlign(this.printer.ALIGN_CENTER);
    this.printer.addText('領収証\n');
    this.printer.addTextAlign(this.printer.ALIGN_LEFT);
    this.printer.addText(this.nowDate + ' '.repeat(25));
    this.printer.addText(this.nowTime + '\n');
    this.printer.addText('<' + this.buyTypeJa + '>\n');

    this.printer.addText('-'.repeat(48) + '\n');

    for (const product of this.cart){
      // 半角スペース除去
      const productName = product.name.replace(/\s/g, '');
      const nameLength = productName.length * 2;

      if (this.cartService.getBuyType() === 'takeout'){
        this.priceLength = product.price02.toLocaleString().length;
        this.totalTax += product.tax02 * product.amount;
      }else{
        this.priceLength = product.price01.toLocaleString().length;
        this.totalTax += product.tax01 * product.amount;
      }
      this.priceAndAmountLength = this.priceLength + ('@' + 'x' + product.amount).length;

      console.log('nameLength:' + nameLength);

      // this.printer.addText(product.name + ' '.repeat(25 - (nameLength)));

      if (nameLength > 48){
        const productNameSlice = productName.slice(0, 24);
        this.printer.addText(productNameSlice);
      }else{
        this.printer.addText(productName);
      }
      this.printer.addText('\n');
      this.printer.addTextAlign(this.printer.ALIGN_RIGHT);


      if (this.cartService.getBuyType() === 'takeout'){
        this.printer.addText('@' + product.price02.toLocaleString() + 'x' + product.amount);
        console.log('this.priceAndAmountLength:' + this.priceAndAmountLength);

        this.printer.addText(' '.repeat(15 - this.priceAndAmountLength));
        this.taxableMethod = product.taxableMethod02;
      }else{
        this.printer.addText('@' + product.price01.toLocaleString() + 'x' + product.amount);
        console.log('this.priceAndAmountLength:' + this.priceAndAmountLength)
        
        this.printer.addText(' '.repeat(15 - this.priceAndAmountLength));
        this.taxableMethod = product.taxableMethod01;
      }

      if (this.taxableMethod === 2){
        this.subTotal = product.price02 * product.amount;
        this.subTotalString = this.subTotal.toLocaleString() + '*';
        this.subTotalLength = this.subTotalString.length;
        // this.taxableMethod02Count += 1;
        this.totalPrice02 += this.subTotal;
        console.log('printer subtotal product.amount:' + product.amount )
        console.log('printer subtotal product.price02:' + product.price02 )
        console.log('printer totalPrice02:' + this.totalPrice02 )
      }else{
        this.subTotal = product.price01 * product.amount;
        console.log('printer subtotal product.amount:' + product.amount )
        console.log('printer subtotal product.price01:' + product.price01 )
        this.subTotalString = this.subTotal.toLocaleString() + ' ';
        this.subTotalLength = this.subTotalString.length;
        // this.taxableMethod01Count += 1;
        this.totalPrice01 += this.subTotal;
        console.log('printer totalPrice01:' + this.totalPrice01 )


      }

      console.log('this.subTotalLength:' + this.subTotalLength);
      this.printer.addText(' '.repeat(8 - this.subTotalLength) + this.subTotalString + '\n');
      this.printer.addTextAlign(this.printer.ALIGN_LEFT);
    }

    this.printer.addText('-'.repeat(48));

    this.printer.addText(' '.repeat(19));
    this.printer.addText('小計');
    // this.printer.addText(' '.repeat(16));
    const totalPaymentString = '\\' + totalPayment;
    const totalPaymentWithTaxString = '\\' + totalPaymentWithTax;
    // this.printer.addText(' '.repeat(8 - totalPaymentString.length));
    this.printer.addText(totalPaymentString.padStart(24) + '\n');

    if(this.cartCoupon.length !== 0){
      this.printer.addText(' '.repeat(19));
      this.printer.addText('クーポン値引');
      const minusCoupon = '-' + '\\' + (this.getTotal() - this.getTotalMinusCoupon()).toLocaleString();
      this.printer.addText(minusCoupon.padStart(16) + '\n');


    }

    let eightPercentTotal = 0
    let tenPercentTotal = 0
    if(this.cartService.getBuyType() === 'takeout'){
      this.cartPriceSorted.map(item=>{
        if(item.taxRate02 === 10){
          tenPercentTotal += item.subtotal
        }else if(item.taxRate02 === 8){
          eightPercentTotal += item.subtotal
        }
      })
    }else{
      this.cartPriceSorted.map(item=>{
        if(item.taxRate01 === 10){
          tenPercentTotal += item.subtotal
        }else if(item.taxRate01 === 8){
          eightPercentTotal += item.subtotal
        }
      })
    }

    // if (this.totalPrice02 > 0){
    if (eightPercentTotal > 0){
      this.printer.addText(' '.repeat(18));
      this.printer.addText('(8%対象');
      // const totalPrice02String = '\\' + this.totalPrice02.toLocaleString() + ')';
      // const totalPrice02String = '\\' + this.getTotalMinusCoupon.toLocaleString() + ')';
      const totalPrice02String = '\\' + eightPercentTotal.toLocaleString() + ')';
      this.printer.addText(totalPrice02String.padStart(23) + '\n');

      this.totalPrice02 = 0
      eightPercentTotal = 0
    }

    // if (this.totalPrice01 > 0){
    if (tenPercentTotal > 0){
      this.printer.addText(' '.repeat(18));
      this.printer.addText('(10%対象');
      // const totalPrice01String = '\\' + this.totalPrice01.toLocaleString() + ')';
      // const totalPrice01String = '\\' + this.getTotalMinusCoupon().toLocaleString() + ')';
      const totalPrice01String = '\\' + tenPercentTotal.toLocaleString() + ')';
      this.printer.addText(totalPrice01String.padStart(22) + '\n');

      this.totalPrice01 = 0
      tenPercentTotal = 0
    }

    // const totalTaxString = '\\' + this.totalTax.toLocaleString() + ')';
    const totalTaxString = '\\' + (this.getTotalWithTax() - this.getTotalMinusCoupon()).toLocaleString() + ')';
    this.printer.addText(' '.repeat(18));
    this.printer.addText('(消費税');
    this.printer.addText(totalTaxString.padStart(23) + '\n');

    this.totalTax = 0


    this.printer.addText(' '.repeat(19));
    this.printer.addTextDouble(true, false);
    this.printer.addText('総合計');
    this.printer.addText(totalPaymentWithTaxString.padStart(8));
    this.printer.addTextDouble(false, false);
    this.printer.addText('\n');


    this.printer.addText('-'.repeat(48));

    const paymentMethod = this.paymentService.getPaymentMethod();
    // if (paymentMethod === undefined){
    //   paymentMethod = 'credit';
    // }
    let paymentMethodString: string;
    switch (paymentMethod){
      case 'cash':
        paymentMethodString = '現金';
        break;
      case 'credit':
        paymentMethodString = 'クレジット';
        break;
      case 'ic':
        paymentMethodString = 'IC';
        break;
      case 'qr':
        paymentMethodString = 'QR';
        break;
    }
    this.printer.addText(paymentMethodString + '支払');
    if (paymentMethod === 'cash' || paymentMethod === 'credit'){
      console.log('paymentMethodString.length:' + paymentMethodString.length);
      this.printer.addText(' '.repeat(48 - ((paymentMethodString.length * 2) + ('支払'.length * 2) + totalPaymentWithTax.length + ' '.length)));
    }else{
      console.log('paymentMethodString.length:' + paymentMethodString.length);

      this.printer.addText(' '.repeat(48 - (paymentMethodString.length + ('支払'.length * 2) + totalPaymentWithTax.length + ' '.length)));
    }
    this.printer.addText(totalPaymentWithTax + '\n');

    if (paymentMethod === 'cash'){
      this.printer.addText('お預り'.padEnd(21));
      this.printer.addText(this.cashService.getDepositAmount().value.toLocaleString().padStart(23));
      this.printer.addText('\n');
      this.printer.addText('おつり'.padEnd(21));
      this.printer.addText(this.cashService.getDispenseAmount().value.toLocaleString().padStart(23));
      this.printer.addText('\n');
    }


    this.printer.addText('[*]は軽減税率対象商品です。\n');

    this.printer.addText('-'.repeat(48) + '\n');

    this.printer.addTextAlign(this.printer.ALIGN_CENTER);
    this.printer.addText('お客様番号' + '\n\n');

    this.printer.addTextDouble(true, true);
    this.printer.addText(this.printerNumString + '-' + this.serialNumString + '\n\n');

    this.printer.addTextDouble(false, false);
    this.printer.addTextAlign(this.printer.ALIGN_LEFT);

    this.printer.addText('レシート番号  ');
    
    this.receiptNumber = this.date1.getFullYear() + this.month1 + this.day1 + this.printerNumString + this.serialNumString;
    this.printer.addText(this.receiptNumber);


    this.printer.addText('\n\n');

    if(this.receiptJson[0].footerImage != ''){
      await this.getCanvasFooter().then(res => console.log('res2:' + res));
      console.log('this.canvasFooter.width2:' + this.canvasFooter.width);
      this.printer.addTextAlign(this.printer.ALIGN_CENTER);
      this.printer.brightness = 1;
      this.printer.halftone = this.printer.HALFTONE_DITHER;
      console.log('addImage2.');
      await this.printer.addImage(await this.contextFooter, 0, 0, this.canvasFooter.width, this.canvasFooter.height, this.printer.COLOR_1, this.printer.MODE_MONO);
  
    }

    // console.log('this.canvasFooter.width2:' + this.canvasFooter.width);


    // this.printer.addTextAlign(this.printer.ALIGN_CENTER);
    // this.printer.brightness = 1;
    // this.printer.halftone = this.printer.HALFTONE_DITHER;
    // console.log('addImage2.');
    // await this.printer.addImage(await this.contextFooter, 0, 0, this.canvasFooter.width, this.canvasFooter.height, this.printer.COLOR_1, this.printer.MODE_MONO);
    this.printer.addTextAlign(this.printer.ALIGN_LEFT);

    console.log('this.printer1:');
    
    this.printer.addText('\n');
    this.printer.addCut(this.printer.CUT_FEED);

    // this.printer.send();

    console.log('this.readValue' + this.readValue);
    console.log('this.paymentService.getPaymentMethod' + this.paymentService.getPaymentMethod());


    if (this.paymentService.getPaymentMethod() !== 'cash' && this.readValue == false){
      await this.receiptPayment();
    } else if (this.readValue == true){
      await this.readValueReceipt();
    }

    this.readValue = false;

    this.printer.send();

    await this.receiptForKitchen();


  }

  async readValueReceipt(){
    const receiptPrinter = this.printer;
    const paymentMethod = this.paymentService.getPaymentMethod();
    let testReceipt: any;

    receiptPrinter.addTextLang('ja');

    receiptPrinter.addTextAlign(receiptPrinter.ALIGN_CENTER);
    receiptPrinter.addText('売上票（お客様控え）');
    receiptPrinter.addText('\n');




    switch (paymentMethod){
      case 'credit':
      case 'ic':
      case 'qr':
        testReceipt = this.paymentService.customerReceipt;
        break;
      case 'report':
        testReceipt = this.paymentService.merchantReceipt;
        break;
    }
    console.log(testReceipt);
    console.log('¥769'.length);
    testReceipt.map(data => {
      console.log('map:' + JSON.stringify(data));
      const attr = JSON.stringify(data.attr).replace(/"/g, '');
      let label = JSON.stringify(data.label).replace(/"/g, '');
      const rowId = JSON.stringify(data.rowid)
      console.log('rowId' + rowId)
      console.log('type' + typeof(rowId))
      console.log('rowId.replace' + rowId.replace(/"/g, ''))
      console.log('data.rowid' + data.rowid)
      console.log('data.rowid.type' + typeof(data.rowid))
      let value = JSON.stringify(data.value).replace(/"/g, '');
      let text1: any;
      let text2: any;
      let isFullWidthLabel: boolean;
      let isFullWidthValue: boolean;
      let containFullWidthLabel: boolean;
      let containFullWidthValue: boolean;
      let isYenValue: boolean;

      if (rowId == '4' || rowId == '5' || rowId == '6' ||rowId == '7' ||rowId == '9' || rowId == '10' || rowId == '11' ||rowId == '12' ||rowId == '13' ){
        if (attr === 'Center'){
          receiptPrinter.addTextAlign(receiptPrinter.ALIGN_CENTER);
          receiptPrinter.addText(label + value);
        }
        if (attr === 'Left' && paymentMethod === 'credit'){
          // receiptPrinter.addTextAlign(receiptPrinter.ALIGN_LEFT);
          // receiptPrinter.addText(label + value);
          return;
        } else if ( attr === 'Left'){
          receiptPrinter.addTextAlign(receiptPrinter.ALIGN_LEFT);
          receiptPrinter.addText(label + value);
        }
        if (attr === 'Empty'){
          receiptPrinter.addText('\n');
        }
        if (attr === 'Line'){
          receiptPrinter.addText(value.repeat(48));
        }
  
        if (attr === 'Right'){
          receiptPrinter.addTextAlign(receiptPrinter.ALIGN_RIGHT);
          receiptPrinter.addText(label + value);
        }

        if (rowId == '7'){
          receiptPrinter.addText('\n');
          receiptPrinter.addTextAlign(receiptPrinter.ALIGN_CENTER);
          receiptPrinter.addText('交通系残高');
          console.log('rowId7 called');
        }

  
        if (attr === 'Justify'){

          if (rowId == '10'){
            const testString = value
            const begin = testString.substring(2,0);
            const end = testString.slice(-4);
            const mask = testString.slice(2,-4);
            const maskString = '*'.repeat(mask.length);
            console.log('begin'+ begin)
            console.log('end'+ end)
            console.log('mask'+ mask)
            console.log('maskString'+ maskString)
            console.log(testString)
            console.log(begin + maskString + end)

            value = begin + maskString + end;
            console.log('value' + value)
          }
  
          // 全て全角文字であればtrue
          isFullWidthLabel = label.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
          isFullWidthValue = value.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
          isYenValue = value.match('¥') ? true : false;
          if (isYenValue === true){
            value = value.replace('¥', '\\');
          }
  
          console.log('isFullWidthLabel' + isFullWidthLabel);
          console.log('isFullWidthValue' + isFullWidthValue);
          if (isFullWidthLabel === false){
            // 全角文字を含んでいればtrue
            containFullWidthLabel = label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
            console.log('containFullWidthLabel' + containFullWidthLabel);
          }
          if (isFullWidthValue === false){
            containFullWidthValue = value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
            console.log('containFullWidthValue' + containFullWidthValue);
          }
  
          if (isFullWidthLabel === true){
            text1 = label.padEnd(24 - label.length);
          }else if (isFullWidthLabel === false && containFullWidthLabel === true){
            let matchLength = 0;
            label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).map(matchValue =>{
              matchLength += matchValue.length;
            });
            text1 = label.padEnd(24 - matchLength);
          }else if (isFullWidthLabel === false && containFullWidthLabel === false){
            text1 = label.padEnd(24);
          }
          if (isFullWidthValue === true){
            text2 = value.padStart(24 - value.length);
          }else if (isFullWidthValue === false && containFullWidthValue === true){
            let matchLength = 0;
            value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).map(matchValue =>{
              matchLength += matchValue.length;
            });
            text2 = value.padEnd(24 - matchLength);
          }else if (isFullWidthValue === false && containFullWidthValue === false){
            text2 = value.padStart(24);
          }
  
          const text3 = text1 + text2;
  
          console.log('text3:' + text3);
          receiptPrinter.addText(text3);
  
          
        }

        if (rowId == '9'){
          console.log('rowId9 called');
          let stringValue = value.replace('\\','');
          console.log('stringValue' + stringValue);
          console.log('this.exReadValue' + this.exReadValue);
          console.log('Number(stringValue.replace' + Number(stringValue.replace(',','')))
          const postReadValue = this.exReadValue - Number(stringValue.replace(',',''));
          console.log('postReadValue' + postReadValue);

          const postReadValueString = '¥' + String(postReadValue);

          receiptPrinter.addText('\n');

          label = '交通系残高'
          value = postReadValueString

          // 全て全角文字であればtrue
          isFullWidthLabel = label.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
          isFullWidthValue = value.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
          isYenValue = value.match('¥') ? true : false;
          if (isYenValue === true){
            value = value.replace('¥', '\\');
          }
  
          console.log('isFullWidthLabel' + isFullWidthLabel);
          console.log('isFullWidthValue' + isFullWidthValue);
          if (isFullWidthLabel === false){
            // 全角文字を含んでいればtrue
            containFullWidthLabel = label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
            console.log('containFullWidthLabel' + containFullWidthLabel);
          }
          if (isFullWidthValue === false){
            containFullWidthValue = value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
            console.log('containFullWidthValue' + containFullWidthValue);
          }
  
          if (isFullWidthLabel === true){
            text1 = label.padEnd(24 - label.length);
          }else if (isFullWidthLabel === false && containFullWidthLabel === true){
            let matchLength = 0;
            label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).map(matchValue =>{
              matchLength += matchValue.length;
            });
            text1 = label.padEnd(24 - matchLength);
          }else if (isFullWidthLabel === false && containFullWidthLabel === false){
            text1 = label.padEnd(24);
          }
          if (isFullWidthValue === true){
            text2 = value.padStart(24 - value.length);
          }else if (isFullWidthValue === false && containFullWidthValue === true){
            let matchLength = 0;
            value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).map(matchValue =>{
              matchLength += matchValue.length;
            });
            text2 = value.padEnd(24 - matchLength);
          }else if (isFullWidthValue === false && containFullWidthValue === false){
            text2 = value.padStart(24);
          }
  
          const text3 = text1 + text2;
  
          console.log('text3:' + text3);
          receiptPrinter.addText(text3);



        }

  
        receiptPrinter.addText('\n');
        receiptPrinter.addTextAlign(receiptPrinter.ALIGN_LEFT);
  
      } else if (rowId == '8'){
        
          console.log('rowId8 called');
          let stringValue = value.replace('\\','');
          console.log('stringValue' + stringValue);
          stringValue = stringValue.replace('¥','');
          console.log('stringValue' + stringValue);
          this.exReadValue = Number(stringValue.replace(',',''));
          console.log('this.exReadValue' + this.exReadValue);
      }


    });

    this.printer.addText('\n\n');
    this.printer.addCut(this.printer.CUT_FEED);



  }

  async receiptPayment(){
    // await this.connect();

    const receiptPrinter = this.printer;
    const paymentMethod = this.paymentService.getPaymentMethod();
    let testReceipt: any;

    receiptPrinter.addTextLang('ja');


    switch (paymentMethod){
      case 'credit':
      case 'ic':
      case 'qr':
        testReceipt = this.paymentService.customerReceipt;
        break;
      case 'report':
        testReceipt = this.paymentService.merchantReceipt;
        break;
    }
    console.log(testReceipt);
    console.log('¥769'.length);
    testReceipt.map(data => {
      console.log('map:' + JSON.stringify(data));
      const attr = JSON.stringify(data.attr).replace(/"/g, '');
      const label = JSON.stringify(data.label).replace(/"/g, '');
      let value = JSON.stringify(data.value).replace(/"/g, '');
      let text1: any;
      let text2: any;
      let isFullWidthLabel: boolean;
      let isFullWidthValue: boolean;
      let containFullWidthLabel: boolean;
      let containFullWidthValue: boolean;
      let isYenValue: boolean;

      if (attr === 'Center'){
        receiptPrinter.addTextAlign(receiptPrinter.ALIGN_CENTER);
        receiptPrinter.addText(label + value);
      }
      if (attr === 'Left' && paymentMethod === 'credit'){
        // receiptPrinter.addTextAlign(receiptPrinter.ALIGN_LEFT);
        // receiptPrinter.addText(label + value);
        return;
      } else if ( attr === 'Left'){
        receiptPrinter.addTextAlign(receiptPrinter.ALIGN_LEFT);
        receiptPrinter.addText(label + value);
      }
      if (attr === 'Empty'){
        receiptPrinter.addText('\n');
      }
      if (attr === 'Line'){
        receiptPrinter.addText(value.repeat(48));
      }

      if (attr === 'Right'){
        receiptPrinter.addTextAlign(receiptPrinter.ALIGN_RIGHT);
        receiptPrinter.addText(label + value);
      }

      if (attr === 'Justify'){

        // 全て全角文字であればtrue
        isFullWidthLabel = label.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
        isFullWidthValue = value.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
        isYenValue = value.match('¥') ? true : false;
        if (isYenValue === true){
          value = value.replace('¥', '\\');
        }

        console.log('isFullWidthLabel' + isFullWidthLabel);
        console.log('isFullWidthValue' + isFullWidthValue);
        if (isFullWidthLabel === false){
          // 全角文字を含んでいればtrue
          containFullWidthLabel = label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
          console.log('containFullWidthLabel' + containFullWidthLabel);
        }
        if (isFullWidthValue === false){
          containFullWidthValue = value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
          console.log('containFullWidthValue' + containFullWidthValue);
        }

        if (isFullWidthLabel === true){
          text1 = label.padEnd(24 - label.length);
        }else if (isFullWidthLabel === false && containFullWidthLabel === true){
          let matchLength = 0;
          label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).map(matchValue =>{
            matchLength += matchValue.length;
          });
          text1 = label.padEnd(24 - matchLength);
        }else if (isFullWidthLabel === false && containFullWidthLabel === false){
          text1 = label.padEnd(24);
        }
        if (isFullWidthValue === true){
          text2 = value.padStart(24 - value.length);
        }else if (isFullWidthValue === false && containFullWidthValue === true){
          let matchLength = 0;
          value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).map(matchValue =>{
            matchLength += matchValue.length;
          });
          text2 = value.padEnd(24 - matchLength);
        }else if (isFullWidthValue === false && containFullWidthValue === false){
          text2 = value.padStart(24);
        }

        const text3 = text1 + text2;

        console.log('text3:' + text3);
        receiptPrinter.addText(text3);

        
      }

      receiptPrinter.addText('\n');
      receiptPrinter.addTextAlign(receiptPrinter.ALIGN_LEFT);

    });

    this.printer.addText('\n\n');
    this.printer.addCut(this.printer.CUT_FEED);


  }

  async receiptForKitchen(){
    // this.connect();

    this.kitchenPrinter.addTextLang('ja');
    
    this.kitchenPrinter.addText('\n\n\n\n\n\n\n\n');

    this.kitchenPrinter.addText('お客様番号  ');
    this.kitchenPrinter.addTextDouble(true, true);
    this.kitchenPrinter.addText(this.printerNumString + '-' + this.serialNumString + '\n');

    if(this.cartService.getBuyType() === 'eatin'){
      this.kitchenPrinter.addTextAlign(this.kitchenPrinter.ALIGN_RIGHT);

      if(this.cartService.getOrderMug() === true){
        this.kitchenPrinter.addText('店内');
      }else if(this.cartService.getOrderMug() === false){
        this.kitchenPrinter.addText('店内 紙');
      }
      this.kitchenPrinter.addText('\n');
      this.kitchenPrinter.addTextAlign(this.kitchenPrinter.ALIGN_LEFT);
    }

    this.kitchenPrinter.addTextDouble(false, false);
    this.kitchenPrinter.addText(this.date1.getFullYear() + '-' + this.month1 + '-' + this.day1 + '  ' + this.hours1 + ':' + this.minutes1 + '\n');

    this.kitchenPrinter.addText('-'.repeat(48) + '\n');

    for (const product of this.cart){
      const productName = product.name.replace(/\s/g, '').slice(0, 8);
      this.kitchenPrinter.addTextDouble(true, true);
      // this.kitchenPrinter.addText(product.name.padEnd(18 - (product.name.length)));
      this.kitchenPrinter.addText(productName.padEnd(16 - (productName.length)));

      // this.kitchenPrinter.addTextDouble(true, true);
      this.kitchenPrinter.addText(String(product.amount).padStart(8) + '\n');
      this.kitchenPrinter.addTextDouble(false, false);

    }

    for(const coupon of this.cartCoupon){
      const couponName = coupon.name.replace(/\s/g, '');
      this.kitchenPrinter.addTextDouble(true, true);
      this.kitchenPrinter.addTextStyle(true);
      if(this.isCouponMatched(coupon)){
        // this.kitchenPrinter.addText(coupon.name.padEnd(18 - (coupon.name.length)));
        this.kitchenPrinter.addText(couponName.slice(0, 18).padEnd(18 - (couponName.length)));

        this.kitchenPrinter.addText(String(coupon.amount).padStart(6) + '\n');  
      }
      // this.kitchenPrinter.addText(coupon.name.padEnd(18 - (coupon.name.length)));

      // this.kitchenPrinter.addText(String(coupon.amount).padStart(6) + '\n');
      this.kitchenPrinter.addTextStyle(false);
      this.kitchenPrinter.addTextDouble(false, false);

    }

    this.kitchenPrinter.addText('-'.repeat(48) + '\n');

    this.kitchenPrinter.addCut(this.kitchenPrinter.CUT_FEED);

    if (this.todayStorage === this.todayString){
      const nextNum = Number(this.serialNumString) + 1;
      const nextNumString = String(nextNum).padStart(4, '0');
      await this.onSetClick('serialNum', nextNumString);
      console.log('if equal');
    }else{
      console.log('today storage error');

    }


    this.kitchenPrinter.send();



  }

  receiptForReport(){
    this.printer.addTextLang('ja');
    this.receiptPayment();
    this.printer.send();
  }
}
