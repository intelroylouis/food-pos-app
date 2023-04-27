import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { PaymentService } from 'src/app/services/payment.service';
// import { CashService } from 'src/app/services/cash.service';
import { ModalController } from '@ionic/angular';
// import { ReportModalPage } from '../../pages/report-modal/report-modal.page';
import { AlertMessagePage } from '../../pages/alert-message/alert-message.page';
import { LogService } from 'src/app/services/log.service';
import { SwUpdate } from '@angular/service-worker';
import { ConnectionService } from 'ng-connection-service';


//　売上処理、プリンター設定、日計、中間計等のボタンがある設定画面です。
// このページでプリンター、キッチンプリンター、釣銭機の接続を行い、状態の確認と通知を行います。


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {



  testJson2: any;

  kitchenPrinterIP: any;
  catIP: any;
  amountLimits: any;
  logStorage: any;
  isAvailable = false;
  passwordNum: any;
  trainingMode: boolean;


  // @ViewChild('report', {static: false, read: ElementRef})fab: ElementRef;


  constructor(public router: Router, public printService: PrintService, public paymentService: PaymentService, public modalCtrl: ModalController, public logService: LogService, private update: SwUpdate, private connectionService: ConnectionService) { }

  async ngOnInit() {



    // const testString = 'JE101311100506059'
    // const begin = testString.substring(2,0);
    // const end = testString.slice(-4);
    // const mask = testString.slice(2,-4);
    // const maskString = '*'.repeat(mask.length);
    // console.log('begin'+ begin)
    // console.log('end'+ end)
    // console.log('mask'+ mask)
    // console.log('maskString'+ maskString)
    // console.log(testString)
    // console.log(begin + maskString + end)

    // let ifTest1 = 2;
    // let ifTest2 = 2;
    // if (ifTest1!=2 && ifTest2==2){
    //   console.log('ifTest success');
    // }

    // this.logService.logJson();
    // this.connectionService.monitor().subscribe(isConnected => {
    //   console.log('isConnected' + isConnected);
    // });

    const onlineStatus = window.navigator.onLine;
    console.log('window.navigator.onLine' + window.navigator.onLine);
    if (onlineStatus === false){
      (document.getElementById('order-button') as any).disabled = false;
      (document.getElementById('update-message') as any).innerHTML = 'POSアプリはオフラインです。アップデートの確認ができません。';
    }

    // window.addEventListener('install', () => {
    //   console.log('install called!!');
    // });

    // window.addEventListener('fetch', () => {
    //   console.log('fetch called!!');
    // });

    // navigator.serviceWorker.addEventListener('updatefound', () => {
    //   console.log('update found!!!');
    // });

    // navigator.serviceWorker.addEventListener('install', () => {
    //   console.log('SW installed!!!');
    // });

    // window.addEventListener('reload', () => {
    //   console.log('reload called!!');
    //   (document.getElementById('order-button') as any).disabled = false;

    // });

    window.addEventListener('load', () => {
      const reloading = sessionStorage.getItem('reloading');
      if (reloading){
        console.log('reload function called');
        (document.getElementById('update-message') as any).innerHTML = 'アップデート完了しました。';
        sessionStorage.removeItem('reloading');
        (document.getElementById('order-button') as any).disabled = false;
      }
    });







    this.updateClient();

    this.kitchenPrinterIP = await this.printService.onGetClick('kitchenPrinterIP');
    this.catIP = await this.paymentService.onGetClick('catIP');
    this.logStorage = await this.paymentService.onGetClick('logStorage');
    this.amountLimits = await this.paymentService.onGetClick('amountLimits');

    if (!this.kitchenPrinterIP){
      await this.printService.onSetClick('kitchenPrinterIP', '127.0.0.1');
    }
    if (!this.catIP){
      await this.printService.onSetClick('catIP', '192.168.1.214');
    }
    if (!this.logStorage){
      await this.printService.onSetClick('logStorage', []);
    }
    if (!this.amountLimits){
      const limitInit = {
        '1円': '20',
        '5円': '20',
        '10円': '20',
        '50円': '20',
        '100円': '20',
        '500円': '10',
        '1000円': '10',
        '5000円': '5',
        '10000円': '5'
      };
      await this.printService.onSetClick('amountLimits', limitInit);

    }

    // this.logStorage = await this.paymentService.onGetClick('logStorage');
    // this.logStorage.push({"name": "test"});
    // console.log(this.logStorage);

    this.printService.setLocalPrinter();
    await this.printService.connect();

    this.printService.sleep(10000).then( () => {
      if (this.isAvailable === false){
        console.log('最新版です。');
        (document.getElementById('order-button') as any).disabled = false;
        if (this.printService.isCashChangerConnected === true){
          (document.getElementById('order-button') as any).disabled = false;
        } else if(this.printService.isPrinterConnected === false){
          document.getElementById('connect-alert').innerHTML = 'プリンター、キッチンプリンター、釣銭機に接続できておりません。';
        } else if(this.printService.isKitchenPrinterConnected === false){
          document.getElementById('connect-alert').innerHTML = 'キッチンプリンター、釣銭機に接続できておりません。';
        } else if(this.printService.isCashChangerConnected === false){
          document.getElementById('connect-alert').innerHTML = '釣銭機に接続できておりません。';
        }
        (document.getElementById('update-message') as any).innerHTML = 'POSアプリは既に最新版です。';
      }
    });
    
    // this.cashService.setCashChanger();
    // console.log('cashchanger:' + this.cashService.cashchanger);
    // this.cashService.createDevice();
    // this.openReportModal();
    // this.testJson();
    // this.testJson();
    // const testReceipt = this.testJson2.OutputCompleteEvent.CustomerReceipt;
    // console.log(testReceipt);
    // console.log('¥769'.length);
    // testReceipt.map(data => {
    //   console.log('map' + JSON.stringify(data));
    //   const attr = JSON.stringify(data.attr).replace(/"/g, '');
    //   const label = JSON.stringify(data.label).replace(/"/g, '');
    //   const value = JSON.stringify(data.value).replace(/"/g, '');
    //   let text1: any;
    //   let text2: any;
    //   let isFullWidthLabel: boolean;
    //   let isFullWidthValue: boolean;
    //   let containFullWidthLabel: boolean;
    //   let containFullWidthValue: boolean;

    //   if (attr === 'Justify'){
    //     // const text3 = label.padEnd(24 - label.length) + value.padStart(24 - value.length);
    //     // console.log('text3:' + text3);

    //     // 全て全角文字であればtrue
    //     isFullWidthLabel = label.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
    //     isFullWidthValue = value.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
    //     console.log('isFullWidthLabel' + isFullWidthLabel);
    //     console.log('isFullWidthValue' + isFullWidthValue);
    //     if(isFullWidthLabel === false){
    //       // 全角文字を含んでいればtrue
    //       containFullWidthLabel = label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
    //       console.log('containFullWidthLabel' + containFullWidthLabel);
    //     }
    //     if(isFullWidthValue === false){
    //       containFullWidthValue = value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
    //       console.log('containFullWidthValue' + containFullWidthValue);
    //     }

    //     if(isFullWidthLabel === true){
    //       text1 = label.padEnd(24 - label.length);
    //     }else if (isFullWidthLabel === false && containFullWidthLabel === true){
    //       text1 = label.padEnd(24 - label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).length);
    //       console.log('length1:'+ label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).length);
    //       console.log(text1);
    //     }else if (isFullWidthLabel === false && containFullWidthLabel === false){
    //       text1 = label.padEnd(24);
    //     }
    //     if(isFullWidthValue === true){
    //       text2 = value.padStart(24 - value.length);
    //     }else if (isFullWidthValue === false && containFullWidthValue === true){
    //       text2 = value.padStart(24 - value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g)[0].length);
    //       console.log('length2:' + value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g)[0].length);
    //       console.log(value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g)[0]);
    //       console.log(text2);
    //     }else if (isFullWidthValue === false && containFullWidthValue === false){
    //       text2 = value.padStart(24);
    //     }

    //     const text3 = text1 + text2;

    //     console.log('text3:' + text3);
        

    //   }
    // })
    this.trainingMode = this.paymentService.trainingMode;
    console.log(this.trainingMode);

    if(this.trainingMode){
      (document.getElementById('trainingMode') as any).checked = true;
    }else{
      (document.getElementById('trainingMode') as any).checked = false;
    }


  }

  modeChange(){
    console.log('before modeChange' + this.paymentService.trainingMode);
    console.log('before modeChange' + (document.getElementById('trainingMode') as any).checked);

    if ((document.getElementById('trainingMode') as any).checked === true){
      this.paymentService.trainingMode = true;
      console.log('true!!!')
    }else{
      this.paymentService.trainingMode = false;
      console.log('false!!!')

    }
    console.log('after modeChange' + this.paymentService.trainingMode);
  }


  async openAlertMessage(){
    let modal = await this.modalCtrl.create({
      component: AlertMessagePage,
      cssClass: 'alert-message'
    });
    modal.present();

  }

  passwordTest(){
    if(this.passwordNum === '1111') this.toWelcomePage()
  }

  passwordNumInput(value){
    if (!this.passwordNum) {
      this.passwordNum = value;
    }else{
      this.passwordNum += value;
    }
    
  }

  passwordClear(){
    this.passwordNum = undefined
  }

  async printRetry(){
    this.paymentService.browserCheck();
    this.paymentService.getFullFeaturedWorker();
    await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));

    await this.paymentService.doMaintenance('printRetry');
  }

  // inputnum(x) {
  //   let mem = document.getElementsByName("mem");
  //   let num = mem[0].value;
  //   num += x;
  //   mem[0].value = num;
  //   console.log(num);
  //   return false;
  // }

  updateClient = () => {
    if (!this.update.isEnabled){
      console.log('Not Enabled');
      return;
    }
    this.update.available.subscribe(event =>{
      console.log(`current`, event.current, `available`, event.available);
      // (document.getElementById('order-button') as any).disabled = true;
      (document.getElementById('update-message')).removeAttribute('hidden');

      console.log('available called');
      this.isAvailable = true;

      sessionStorage.setItem('reloading', 'true');

      // if (confirm('update available for the app please confirm')) {
      this.update.activateUpdate().then(() => location.reload());
      // }
    }, error => {
      console.log('available error' + error);
    });

    // this.update.checkForUpdate().then(res => {
    //   console.log(res);
    // });

    console.log('updateClient()');
    console.log(this.update.available);
    

    this.update.activated.subscribe(event => {
      console.log(`previous`, event.previous, `current`, event.current);
      (document.getElementById('order-button') as any).disabled = false;
      (document.getElementById('update-message') as any).innerHTML = 'POSアプリを最新版にアップデートしています。';
      sessionStorage.setItem('reloading', 'true');
    }, error => {
      console.log('activated error' + error);
    });

  }

  toWelcomePage(){
    this.router.navigateByUrl('welcome');
  }

  toSettingsPrinter(){
    this.router.navigateByUrl('settings/settings-printer');
  }

  async dailyReportTest(){
    this.openAlertMessage();
    
    // this.paymentService.setIsReport();
    // this.paymentService.browserCheck();
    // this.paymentService.getFullFeaturedWorker();
    // await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));

    // this.paymentService.dailyReport();

    // this.printService.receiptForReport();
  }

  async midReportTest(){
    this.paymentService.setIsReport();
    this.paymentService.browserCheck();
    this.paymentService.getFullFeaturedWorker();
    await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));

    this.paymentService.midReport();
  }

  intervalReceiptForReport(){
    if (this.paymentService.merchantReceipt !== undefined){
      this.printService.receiptForReport();
      
    }
  }

  // testJson(){
  //   this.testJson2 = {"OutputCompleteEvent":{"AccountNumber":"3584 03** **** 1589","AdditionalSecurityInformation":{"TerminalID":"77158119","aid":"A0000000651010","appLabel":"JCB Credit","arc":"ARC00","atc":"ATC00033","bin":"358403","contents":{"1":"","2":""},"cvm":"PIN","date":"20/09/30 10:34:02","discount":0,"fgnCurCode":"392","maxUsageCount":0,"panSeqNo":"C00","usageCount":0},"ApprovalCode":"118523","CardCompanyID":"102","CenterResultCode":"","CreditCompanyReceipt":[{"attr":"Center","label":"","rowid":1,"value":"クレジットカード売上票"},{"attr":"Justify","label":"加盟店名","rowid":2,"value":"日光企画"},{"attr":"Justify","label":"TEL","rowid":3,"value":"00-0000-0000"},{"attr":"Justify","label":"カード会社","rowid":4,"value":"ジェーシービー(102)"},{"attr":"Justify","label":"伝票番号","rowid":5,"value":"00068"},{"attr":"Justify","label":"端末番号","rowid":6,"value":"77158-119-91001"},{"attr":"Justify","label":"ご利用日","rowid":7,"value":"2020/09/30 10:34:02"},{"attr":"Justify","label":"カード番号","rowid":8,"value":"358403XXXXXX1589"},{"attr":"Right","label":"","rowid":9,"value":"IC"},{"attr":"Justify","label":"有効期限","rowid":10,"value":"XX/XX"},{"attr":"Justify","label":"取引内容","rowid":11,"value":"売上"},{"attr":"Justify","label":"支払区分","rowid":12,"value":"一括払い"},{"attr":"Justify","label":"商品区分","rowid":13,"value":"0000"},{"attr":"Justify","label":"処理通番","rowid":14,"value":"035820"},{"attr":"Justify","label":"承認番号","rowid":15,"value":"118523"},{"attr":"Justify","label":"金額","rowid":16,"value":"¥648"},{"attr":"Justify","label":"合計金額","rowid":17,"value":"¥648"},{"attr":"Line","label":"","rowid":18,"value":"-"},{"attr":"Left","label":"","rowid":19,"value":"暗証番号を確認済みです。"},{"attr":"Left","label":"","rowid":20,"value":"サインは不要です。"},{"attr":"Line","label":"","rowid":21,"value":"-"},{"attr":"Left","label":"","rowid":22,"value":"ARC00 ATC00033 C00"},{"attr":"Left","label":"","rowid":23,"value":"A0000000651010"},{"attr":"Left","label":"","rowid":24,"value":"JCB Credit"},{"attr":"Left","label":"","rowid":25,"value":"CN"},{"attr":"Center","label":"","rowid":26,"value":"■ ■ ■カード会社控え■ ■ ■"}],"CurrentService":"Credit","CustomerReceipt":[{"attr":"Center","label":"","rowid":1,"value":"クレジットカード売上票"},{"attr":"Justify","label":"加盟店名","rowid":2,"value":"日光企画"},{"attr":"Justify","label":"TEL","rowid":3,"value":"00-0000-0000"},{"attr":"Justify","label":"カード会社","rowid":4,"value":"ジェーシービー(102)"},{"attr":"Justify","label":"伝票番号","rowid":5,"value":"00068"},{"attr":"Justify","label":"端末番号","rowid":6,"value":"77158-119-91001"},{"attr":"Justify","label":"ご利用日","rowid":7,"value":"2020/09/30 10:34:02"},{"attr":"Justify","label":"カード番号","rowid":8,"value":"XXXXXXXXXXXX1589"},{"attr":"Right","label":"","rowid":9,"value":"IC"},{"attr":"Justify","label":"有効期限","rowid":10,"value":"XX/XX"},{"attr":"Justify","label":"取引内容","rowid":11,"value":"売上"},{"attr":"Justify","label":"支払区分","rowid":12,"value":"一括払い"},{"attr":"Justify","label":"商品区分","rowid":13,"value":"0000"},{"attr":"Justify","label":"処理通番","rowid":14,"value":"035820"},{"attr":"Justify","label":"承認番号","rowid":15,"value":"118523"},{"attr":"Justify","label":"金額","rowid":16,"value":"¥648"},{"attr":"Justify","label":"合計金額","rowid":17,"value":"¥648"},{"attr":"Left","label":"","rowid":18,"value":"ARC00 ATC00033 C00"},{"attr":"Left","label":"","rowid":19,"value":"A0000000651010"},{"attr":"Left","label":"","rowid":20,"value":"JCB Credit"},{"attr":"Left","label":"","rowid":21,"value":"CN"},{"attr":"Center","label":"","rowid":22,"value":"■ ■ ■お客様控え■ ■ ■"}],"MerchantReceipt":[{"attr":"Center","label":"","rowid":1,"value":"クレジットカード売上票"},{"attr":"Justify","label":"加盟店名","rowid":2,"value":"日光企画"},{"attr":"Justify","label":"TEL","rowid":3,"value":"00-0000-0000"},{"attr":"Justify","label":"カード会社","rowid":4,"value":"ジェーシービー(102)"},{"attr":"Justify","label":"伝票番号","rowid":5,"value":"00068"},{"attr":"Justify","label":"端末番号","rowid":6,"value":"77158-119-91001"},{"attr":"Justify","label":"ご利用日","rowid":7,"value":"2020/09/30 10:34:02"},{"attr":"Justify","label":"カード番号","rowid":8,"value":"358403XXXXXX1589"},{"attr":"Right","label":"","rowid":9,"value":"IC"},{"attr":"Justify","label":"有効期限","rowid":10,"value":"XX/XX"},{"attr":"Justify","label":"取引内容","rowid":11,"value":"売上"},{"attr":"Justify","label":"支払区分","rowid":12,"value":"一括払い"},{"attr":"Justify","label":"商品区分","rowid":13,"value":"0000"},{"attr":"Justify","label":"処理通番","rowid":14,"value":"035820"},{"attr":"Justify","label":"承認番号","rowid":15,"value":"118523"},{"attr":"Justify","label":"金額","rowid":16,"value":"¥648"},{"attr":"Justify","label":"合計金額","rowid":17,"value":"¥648"},{"attr":"Left","label":"","rowid":18,"value":"ARC00 ATC00033 C00"},{"attr":"Left","label":"","rowid":19,"value":"A0000000651010"},{"attr":"Left","label":"","rowid":20,"value":"JCB Credit"},{"attr":"Left","label":"","rowid":21,"value":"CN"},{"attr":"Center","label":"","rowid":22,"value":"■ ■ ■加盟店控え■ ■ ■"}],"PaymentCondition":10,"PaymentDetail":"","SequenceNumber":39010001,"SettledAmount":648,"SlipNumber":"00068","TransactionNumber":"035820","TransactionType":10}};
    
  // }

  // testJson(){
  //   this.testJson2 = {"OutputCompleteEvent":{"DailyLog":"DailyLog","MerchantReceipt":[{"attr":"Center","label":"","rowid":1,"value":"日計"},{"attr":"Empty","label":"","rowid":2,"value":"1"},{"attr":"Justify","label":"加盟店名","rowid":3,"value":"日光企画"},{"attr":"Justify","label":"TEL","rowid":4,"value":"00-0000-0000"},{"attr":"Justify","label":"端末識別番号","rowid":5,"value":"0001990001001"},{"attr":"Empty","label":"","rowid":6,"value":"1"},{"attr":"Line","label":"","rowid":7,"value":"="},{"attr":"Left","label":"","rowid":8,"value":"クレジット"},{"attr":"Empty","label":"","rowid":9,"value":"1"},{"attr":"Justify","label":"前回日計日時","rowid":10,"value":"20/10/02 11:31:48"},{"attr":"Justify","label":"集計日時","rowid":11,"value":"20/10/02 11:43:01"},{"attr":"Empty","label":"","rowid":12,"value":"1"},{"attr":"Right","label":"","rowid":13,"value":"取引データ無し"},{"attr":"Line","label":"","rowid":14,"value":"="},{"attr":"Left","label":"","rowid":15,"value":"電子マネー"},{"attr":"Empty","label":"","rowid":16,"value":"1"},{"attr":"Justify","label":"前回日計日時","rowid":17,"value":"20/10/02 11:31:58"},{"attr":"Justify","label":"集計日時","rowid":18,"value":"20/10/02 11:43:02"},{"attr":"Empty","label":"","rowid":19,"value":"1"},{"attr":"Right","label":"","rowid":20,"value":"取引データ無し"},{"attr":"Line","label":"","rowid":21,"value":"="},{"attr":"Left","label":"","rowid":22,"value":"Edy締め処理"},{"attr":"Empty","label":"","rowid":23,"value":"1"},{"attr":"Justify","label":"通信日時","rowid":24,"value":"20/10/02 11:43:02"},{"attr":"Empty","label":"","rowid":25,"value":"1"},{"attr":"Justify","label":"上位端末ID","rowid":26,"value":"F0001482"},{"attr":"Justify","label":"支払い             0","rowid":27,"value":"¥0"},{"attr":"Justify","label":"チャージ           0","rowid":28,"value":"¥0"},{"attr":"Justify","label":"支払いアラーム     0","rowid":29,"value":"¥0"},{"attr":"Justify","label":"チャージアラーム   0","rowid":30,"value":"¥0"},{"attr":"Justify","label":"センター通信結果","rowid":31,"value":"成功"},{"attr":"Line","label":"","rowid":32,"value":"="},{"attr":"Left","label":"","rowid":33,"value":"QR決済"},{"attr":"Empty","label":"","rowid":34,"value":"1"},{"attr":"Justify","label":"前回日計日時","rowid":35,"value":"20/10/02 11:32:01"},{"attr":"Justify","label":"集計日時","rowid":36,"value":"20/10/02 11:43:09"},{"attr":"Empty","label":"","rowid":37,"value":"1"},{"attr":"Right","label":"","rowid":38,"value":"取引データ無し"},{"attr":"Line","label":"","rowid":39,"value":"="},{"attr":"Empty","label":"","rowid":40,"value":"1"},{"attr":"Center","label":"","rowid":41,"value":"■■■加盟店控え■■■"}],"SequenceNumber":1}};
  
  //   const testReceipt = this.testJson2.OutputCompleteEvent.MerchantReceipt;
  //   console.log(testReceipt);
  //   console.log('¥769'.length);
  //   testReceipt.map(data => {
  //     console.log('map' + JSON.stringify(data));
  //     const attr = JSON.stringify(data.attr).replace(/"/g, '');
  //     const label = JSON.stringify(data.label).replace(/"/g, '');
  //     const value = JSON.stringify(data.value).replace(/"/g, '');
  //     let text1: any;
  //     let text2: any;
  //     let isFullWidthLabel: boolean;
  //     let isFullWidthValue: boolean;
  //     let containFullWidthLabel: boolean;
  //     let containFullWidthValue: boolean;

  //     if (attr === 'Justify'){
  //       // const text3 = label.padEnd(24 - label.length) + value.padStart(24 - value.length);
  //       // console.log('text3:' + text3);

  //       // 全て全角文字であればtrue
  //       isFullWidthLabel = label.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
  //       isFullWidthValue = value.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
  //       console.log('isFullWidthLabel' + isFullWidthLabel);
  //       console.log('isFullWidthValue' + isFullWidthValue);
  //       if(isFullWidthLabel === false){
  //         // 全角文字を含んでいればtrue
  //         containFullWidthLabel = label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
  //         console.log('containFullWidthLabel' + containFullWidthLabel);
  //       }
  //       if(isFullWidthValue === false){
  //         containFullWidthValue = value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g) ? true : false;
  //         console.log('containFullWidthValue' + containFullWidthValue);
  //       }

  //       if(isFullWidthLabel === true){
  //         text1 = label.padEnd(24 - label.length);
  //       }else if (isFullWidthLabel === false && containFullWidthLabel === true){
  //         text1 = label.padEnd(24 - label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).length);
  //         console.log('length1:'+ label.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g).length);
  //         console.log(text1);
  //       }else if (isFullWidthLabel === false && containFullWidthLabel === false){
  //         text1 = label.padEnd(24);
  //       }
  //       if(isFullWidthValue === true){
  //         text2 = value.padStart(24 - value.length);
  //       }else if (isFullWidthValue === false && containFullWidthValue === true){
  //         text2 = value.padStart(24 - value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g)[0].length);
  //         console.log('length2:' + value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g)[0].length);
  //         console.log(value.match(/[^\x00-\x7Eｧ-ﾝﾞﾟ]+/g)[0]);
  //         console.log(text2);
  //       }else if (isFullWidthValue === false && containFullWidthValue === false){
  //         text2 = value.padStart(24);
  //       }

  //       const text3 = text1 + text2;

  //       console.log('text3:' + text3);
        

  //     }
  //   });

  // }
}
