import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaymentService } from './payment.service';
import { ActivatedRoute, Router} from '@angular/router';
import { Storage } from '@ionic/storage';



// 釣銭機のサービス。
// 釣銭機のコネクトは、プリンターと同様print.service.tsで行なっています。



@Injectable({
  providedIn: 'root'
})
export class CashService {

  // depositAmount = 0;
  private depositAmount = new BehaviorSubject(0);
  private dispenseAmount = new BehaviorSubject(0);


  constructor(public paymentService: PaymentService, public activeRoute: ActivatedRoute, public storage: Storage, public router: Router) { }

  ipAddress = null;
  port = null;
  deviceID = null;

  cashchanger = null;

  // ePosDev = new epson.ePOSDevice();

  totalPayment: number;
  totalPaymentWithTax: number;

  endRepay = false;


  setCashChanger(driver){
    this.cashchanger = driver;
  }


  OnError(sq, deviceID, code) {
    console.log('sq: ' + sq, true);
    console.log('deviceID: ' + deviceID);
    console.log('code: ' + code);
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
    // console.log('onStatusChange');
  }

  SendDirectIOCommand = () => {

    if (this.cashchanger == null) {
      console.log('driver object is not loaded.');
    }
    else {
      console.log('direct IO called');
      this.cashchanger.oncommandreply = this.onDirectIOCommandReply;
      // var command = document.getElementById("directIOCommand").value;
      // var data = document.getElementById("directIOData").value;
      // var string = document.getElementById("directIOString").value;
      // ex) Deposit data read: command: 13, data: 0, string: ""
      const command1 = 'CHAN_DI_STATUSREAD';
      const data1 = '0x01';
      const s = '';


      const directIO = {command: command1, data: data1, string: s };
      this.cashchanger.sendCommand(directIO);
      console.log('direct IO done');
    }
  }

  onDirectIOCommandReply(data) {
    console.log("status: " + data.status + "\r\n", true);
    console.log("command: " + data.command);
    console.log("data: " + data.data);
    console.log("string: " + data.string);
  }

  BeginDeposit = () => {

    if (this.cashchanger == null) {
      console.log('driver object is not loaded.');
    }
    else {
      this.cashchanger.ondeposit = this.onDeposit;
      this.cashchanger.beginDeposit();
      console.log('cashchanger begin');
    }
  }
  
  onDeposit = (data) => {
    console.log("status: " + data.status + "\t", true);
    switch(data.status){
      case 'COMMAND_ERROR':
      case 'DEVICE_ERROR':
      case 'SYSTEM_ERROR':
      case 'OPOS_CODE_XX':
        console.log('エラーが発生しました。:' + data.status);
        break;
      case 'BUSY':
        console.log('test started!!!');
        break;
    }
    const paramId = location.pathname;
    console.log('paramId onDeposit:' + paramId);
    if(data.status == 'DEVICE_ERROR' && paramId == '/payment-menu/payment-cash'){
      this.paymentService.errorMessage = '釣り銭機の状態を確認してください。'
      console.log('DEVICE_ERROR and toErrorPage called');
      this.router.navigateByUrl('payment-menu/payment-error');
    }


    console.log("new amount: " + data.amount + "YEN" + "\r\n");
    console.log("10000YEN: " + data.jpy10000 + "\t");
    console.log("5000YEN: " + data.jpy5000 + "\t");
    console.log("2000YEN: " + data.jpy2000 + "\t");
    console.log("1000YEN: " + data.jpy1000 + "\t");
    console.log("500YEN: " + data.jpy500 + "\r\n");
    console.log("100YEN: " + data.jpy100 + "\t");
    console.log("50YEN: " + data.jpy50 + "\t");
    console.log("10YEN: " + data.jpy10 + "\t");
    console.log("5YEN: " + data.jpy5 + "\t");
    console.log("1YEN: " + data.jpy1 + "\r\n");
    this.depositAmount.next(data.amount);
    console.log('this.depositAmount' + this.depositAmount);
    console.log(typeof(this.depositAmount.value));
    this.depositAmount.next(Number(data.amount));
    console.log(typeof(this.depositAmount.value));
    this.paymentService.getTotal();
    this.paymentService.getTotalWithTax();
    this.totalPayment = this.paymentService.totalPrice;
    this.totalPaymentWithTax = this.paymentService.totalPriceWithTax;
    console.log('this.dispenseAmount.value2:' + this.dispenseAmount.value);
    console.log('this.depositAmount.value2:' + this.depositAmount.value);
    console.log('this.totalPaymentWithTax2:' + this.totalPaymentWithTax);
    

    // (this.depositAmount.value - this.totalPayment) < 0 ? this.dispenseAmount.next(0) : this.dispenseAmount.next(this.depositAmount.value - this.totalPayment);
    (this.depositAmount.value - this.totalPaymentWithTax) < 0 ? this.dispenseAmount.next(0) : this.dispenseAmount.next(this.depositAmount.value - this.totalPaymentWithTax);
    console.log(this.totalPaymentWithTax);

    if(data.status === 'END'){
      if(this.endRepay === true){
        // (document.getElementById('cash-end-button') as any).disabled = false;
        this.router.navigateByUrl('payment-menu');
        this.endRepay = false;
        return;
      }
      (document.getElementById('cash-cancel-button') as any).disabled = false;
      console.log('END called!!!');
      console.log('this.dispenseAmount.value3:' + this.dispenseAmount.value);
      console.log('this.depositAmount.value3:' + this.depositAmount.value);
      this.DispenseChange(this.dispenseAmount.value);
      this.cashchanger.readCashCounts();
      this.router.navigateByUrl('payment-menu/payment-success');
      this.endRepay = false;


    }
    // this.paymentCashPage.depositAmount = this.depositAmount;
  }

  // setDepositNumber(data){
  //   this.depositAmount.next(data.amount);
  //   console.log('this.depositAmount' + this.depositAmount);
  //   console.log(typeof(this.depositAmount.value));
  //   this.depositAmount.next(Number(data.amount));
  //   console.log(typeof(this.depositAmount.value));
  //   console.log('hi');
  // }

  ReadCashCounts = () => {
    if (this.cashchanger == null) {
      console.log('driver object is not loaded.');
    }
    else {
      this.cashchanger.oncashcounts = this.onCashCounts;
      this.cashchanger.readCashCounts();
    }
  }
  
  onCashCounts = async (data) => {
    // const paramId = this.activeRoute.snapshot.params.id;
    const paramId = location.pathname;
    const amountLimits = await this.onGetClick('amountLimits');
    for (const limit of Object.keys(amountLimits)){
      amountLimits[limit] = Number(amountLimits[limit]);
    }

    console.log('amountLimits:' + amountLimits);
    console.log('amountLimits:' + JSON.stringify(amountLimits));
    console.log('amountLimits type:' + typeof(amountLimits['1円']));

    // const paramId = this.location.pathname;
    console.log('paramId' + paramId);

    console.log('readcashData:' + data);
    console.log('readcashData2:' + JSON.stringify(data));
    console.log("status: " + data.status + "\r\n", true);
    console.log("10000YEN: " + data.jpy10000 + "\t");
    console.log("5000YEN: " + data.jpy5000 + "\t");
    console.log("2000YEN: " + data.jpy2000 + "\t");
    console.log("1000YEN: " + data.jpy1000 + "\t");
    console.log("500YEN: " + data.jpy500 + "\r\n");
    console.log("100YEN: " + data.jpy100 + "\t");
    console.log("50YEN: " + data.jpy50 + "\t");
    console.log("10YEN: " + data.jpy10 + "\t");
    console.log("5YEN: " + data.jpy5 + "\t");
    console.log("1YEN: " + data.jpy1 + "\t");
    console.log("10000YEN CASSETTE: " + data.jpy10000cassette + "\t");
    console.log("5000YEN CASSETTE: " + data.jpy5000cassette + "\t");
    console.log("2000YEN CASSETTE: " + data.jpy2000cassette + "\t");
    console.log("1000YEN CASSETTE: " + data.jpy1000cassette + "\r\n");

    let sEmpty = '';
    let sNearEmpty = '';


    for (const cash of Object.keys(data) ){
      if (cash === 'status' || cash === 'type'){
        continue;
      }
      const amount = Number(data[cash]);
      const name = cash.replace('jpy', '');
      // if (amount <= 5){
      //   const s = cash.replace('jpy', '');
      //   console.log(s + '円が不足しています。補充してください。');
      //   if (paramId === 'settings'){
      //     console.log('settings画面操作');
      //   }
      // }
      let isNearEmpty = false;
      let isEmpty = false;

      switch (name){
        case '1':
          if (amount <= amountLimits['1円']) { isNearEmpty = true; }
          if (amount === 0) { isEmpty = true; }
          break;
        case '5':
          if (amount <= amountLimits['5円']) { isNearEmpty = true; }
          if (amount === 0) { isEmpty = true; }
          break;
        case '10':
          if (amount <= amountLimits['10円']) { isNearEmpty = true; }
          if (amount === 0) { isEmpty = true; }
          break;
        case '50':
          if (amount <= amountLimits['50円']) { isNearEmpty = true; }
          if (amount === 0) { isEmpty = true; }
          break;
        case '100':
          if (amount <= amountLimits['100円']) { isNearEmpty = true; }
          if (amount === 0) { isEmpty = true; }
          break;
        case '500':
          if (amount <= amountLimits['500円']) { isNearEmpty = true; }
          if (amount === 0) { isEmpty = true; }
          break;
        case '1000':
          if (amount <= amountLimits['1000円']) { isNearEmpty = true; }
          if (amount === 0) { isEmpty = true; }
          break;
        case '5000':
          if (amount <= amountLimits['5000円']) { isNearEmpty = true; }
          if (amount === 0) { isEmpty = true; }
          break;
        case '10000':
          if (amount < amountLimits['10000円']) { isNearEmpty = true; }
          // if (amount === 0) { isEmpty = true; }
          break;
      }
      console.log('isEmpty check:' + name + ':' + isEmpty)
      console.log('isNearEmpty check:' + name + ':' + isNearEmpty)

      if (isEmpty){
        console.log(name + '円が空になりました。補充してください。');
        sEmpty += name + '円、';
      } else if (isNearEmpty){
        console.log(name + '円が不足しています。補充してください。');
        sNearEmpty += name + '円、';
      }

      console.log('sEmpty check:' + name + ':' + sEmpty)
      console.log('sNearEmpty check:' + name + ':' + sNearEmpty)


    }
    if (sEmpty) {
      const message = sEmpty + 'が空になりました。補充してください。';
      console.log('sEmpty' + message);
      if (paramId === '/settings'){
        document.getElementById('cash-empty').innerHTML = message;
        // this.storage.remove('sEmpty');
      } else {
        this.storage.set('sEmpty', message);
      }
    }else if (sNearEmpty) {
      const message = sNearEmpty + 'が不足しています。補充してください。';
      console.log('sNearEmpty' + message);
      if (paramId === '/settings'){
        document.getElementById('cash-nearempty').innerHTML = message;
        this.storage.remove('sNearEmpty');
      } else {
        this.storage.set('sNearEmpty', message);
      }
    }else{
      this.storage.remove('sEmpty');
      this.storage.remove('sNearEmpty');
      console.log('sempty and sNearempty removed from storage!!!')
    }

    if (paramId === '/settings') {console.log('設定画面です。'); }

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

  getDepositAmount(){
    return this.depositAmount;
  }

  getDispenseAmount(){
    return this.dispenseAmount;
  }

  testChange(){
    this.depositAmount.next(this.depositAmount.value + 200);
    console.log(this.depositAmount);
    this.paymentService.getTotal();
    this.totalPayment = this.paymentService.totalPrice;
    (this.depositAmount.value - this.totalPayment) < 0 ? this.dispenseAmount.next(0) : this.dispenseAmount.next(this.depositAmount.value - this.totalPayment);
    console.log(this.totalPayment);
    // const testDeposit = document.getElementById('deposit');
    // console.log(testDeposit.textContent);
    // console.log(testDeposit.innerHTML);
    // testDeposit.textContent = 'お預かり金額'
  }
  
  EndDeposit() {

    if (this.cashchanger == null) {
      console.log('driver object is not loaded.');
    }
    else {
      this.cashchanger.ondeposit = this.onDeposit;
      // this.cashchanger.endDeposit(this.cashchanger.DEPOSIT_NOCHANGE);
      this.cashchanger.endDeposit(this.cashchanger.DEPOSIT_CHANGE);
    }
  }

  EndDepositRepay() {

    if (this.cashchanger == null) {
      console.log('driver object is not loaded.');
    }
    else {
      this.cashchanger.ondeposit = this.onDeposit;
      this.cashchanger.endDeposit(this.cashchanger.DEPOSIT_REPAY);
    }
  }

  DispenseChange = (cash) => {

    if (this.cashchanger == null) {
      console.log('driver object is not loaded.');
    }
    else {
      this.cashchanger.ondispense = this.onDispense;

      // var cash = document.getElementById("cashAmountDispense").value;
      this.cashchanger.dispenseChange(cash);
    }
  }

  onDispense(data) {
    console.log('onDispense console')
    console.log("status: " + data.status);
    switch (data.status){
      case 'COMMAND_ERROR':
      case 'DEVICE_ERROR':
      case 'SYSTEM_ERROR':
      case 'ILLEGAL_PARAMETER_ERROR':
      case 'OPOS_CODE_XX':
        console.log('エラーが発生しました。:' + data.status);
        break;
    }
  }

  CollectAllCash() {

    if (this.cashchanger == null) {
      console.log('driver object is not loaded.');
    }
    else {
      this.cashchanger.oncollect = this.onCollectCash;
      this.cashchanger.collectCash(this.cashchanger.COLLECT_ALL_CASH);
    }

  }
  
  onCollectCash(data) {
    console.log("status: " + data.status, true);
  }


}
