import {Injectable} from '@angular/core';

declare var FullFeaturedWorker: any;
import {Router} from '@angular/router';
import {CartService} from './cart.service';
import {CouponService} from './coupon.service';
import {Storage} from '@ionic/storage';
import {ModalController} from '@ionic/angular';
import {ReportModalPage} from '../pages/report-modal/report-modal.page';
import { environment } from '../../environments/environment';

// クレジット、IC、QRの決済サービス。


@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    host: any;
    port: number;
    request: any;
    FullFeaturedWorker: any;
    checkMsg: string;
    resCode: string;
    errorMessage: string;
    toErrorPage: boolean;
    toMaintenancePage = false;
    private paymentMethod: string;
    // cart = this.cartService.getCart();
    totalPrice: number;
    totalPriceWithTax: number;
    date1: any;
    month1: any;
    day1: any;
    sequenceNumber: any;
    customerReceipt: any;
    merchantReceipt: any;
    outputJson: any;
    isCancelled = false;
    // isReport: boolean;
    private readValueMethod: string;
    readValue: number;
    trainingMode = environment.trainMode;


    constructor(
        public router: Router,
        public cartService: CartService,
        public couponService: CouponService,
        public storage: Storage,
        public modalCtrl: ModalController) {
        this.port = 3647;
        // this.trainingMode = environment.trainMode;
    }

    // VescaJS FullFeatured-WSの初期化、起動設定

    public cart = [];
    public cartCoupon = [];
    public cartPriceSorted = [];

    setIsReport() {
        this.paymentMethod = 'report';
    }

    onGetClick(key: string) {
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

    getDateAndStorage() {
        return new Promise(async resolve => {

            this.date1 = new Date();
            this.month1 = this.date1.getMonth() + 1;
            this.day1 = this.date1.getDate() < 10 ? '0' + this.date1.getDate() : this.date1.getDate();

            const serialNum = await this.onGetClick('serialNum');
            const printerNum = await this.onGetClick('printerNum');

            const dateAndStorage = await this.month1 + this.day1 + printerNum + serialNum;
            console.log('dateAndStorage' + dateAndStorage);
            this.sequenceNumber = Number(dateAndStorage);
            resolve(this.sequenceNumber);
        });
    }

    getTotal() {
        this.cart = this.cartService.getCart();
        console.log('this.cart' + this.cart);
        console.log('getBuyType' + this.cartService.getBuyType());
        if (this.cartService.getBuyType() === 'takeout') {
            this.totalPrice = this.cart.reduce((i, j) => i + j.price02 * j.amount, 0);
        } else {
            this.totalPrice = this.cart.reduce((i, j) => i + j.price01 * j.amount, 0);
        }
    }

    // getTotalMinusCoupon(){
    //     this.cartCoupon = this.couponService.getCartCoupon();
    //     // let totalMinusCoupon:any = this.getTotal();
    //     this.getTotal();
    //     let totalMinusCoupon = this.totalPrice;

    //     this.cartCoupon.map((coupon) =>{
    //       if(this.isCouponMatched(coupon)){
    //         totalMinusCoupon -= (coupon.discount_price * coupon.amount);
    //         console.log('totalMinusCoupon'+ totalMinusCoupon)
    //       }
    //     })
    //     if(totalMinusCoupon<0) totalMinusCoupon=0;
    //     return totalMinusCoupon
    // }

    getTotalMinusCoupon(){
        let totalMinusCoupon = 0;
        this.cartPriceSorted = this.cartService.getCartPriceSorted();

        console.log('cartPriceSorted2:' + JSON.stringify(this.cartPriceSorted));
        console.log('getCart()2:' + JSON.stringify(this.cartService.getCart()));


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


        console.log('cartPriceSorted3:' + JSON.stringify(this.cartPriceSorted));

        this.cartPriceSorted.map(item => {
          totalMinusCoupon += item.subtotal;
        });
        return totalMinusCoupon;
    }

    isCouponMatched = (coupon) => {
        if (coupon.target === 'all' && this.cart.length !== 0){
            return true;
        }
        let couponMatched = 0;
        for (let i = 0; i < this.cart.length; i++){
            if (coupon.target.includes(this.cart[i].id)){
            couponMatched += 1;
            }
        }
        console.log('couponMatched' + couponMatched);
        return couponMatched >= 1;
    }


    // getTotalWithTax() {
    //     // this.cart = this.cartService.getCart();
    //     // let totalMinusCoupon = this.getTotalMinusCoupon();
    //     // console.log('this.cart' + this.cart);
    //     console.log('getBuyType' + this.cartService.getBuyType());
    //     if (this.cartService.getBuyType() === 'takeout') {
    //         // this.totalPriceWithTax = totalMinusCoupon * ((this.cart[0].taxRate02 * 0.01) + 1);
    //         this.totalPriceWithTax = Math.floor(this.totalPriceWithTax)
    //         // this.totalPriceWithTax = this.cart.reduce((i, j) => i + (j.price02 * j.amount + j.tax02 * j.amount), 0);
    //     } else {
    //         // this.totalPriceWithTax = totalMinusCoupon * ((this.cart[0].taxRate01 * 0.01) + 1);
    //         this.totalPriceWithTax = Math.floor(this.totalPriceWithTax)
    //         // this.totalPriceWithTax = this.cart.reduce((i, j) => i + (j.price01 * j.amount + j.tax01 * j.amount), 0);
    //     }
    // }

    getTotalWithTax(){
        console.log('this.getTotalMinusCoupon()' + this.getTotalMinusCoupon());
        console.log('cartPriceSorted4:' + JSON.stringify(this.cartPriceSorted));
        this.totalPriceWithTax = 0;
        if (this.cartService.getBuyType() === 'takeout'){
            this.cartPriceSorted.map(item => {
                this.totalPriceWithTax += Math.floor(item.subtotal * (item.taxRate02 * 0.01 + 1));
                console.log('subtotal!!!!!');
                console.log('this.totalPriceWithTax5:' + this.totalPriceWithTax);
            });
        }else{
            this.cartPriceSorted.map(item => {
                this.totalPriceWithTax += Math.floor(item.subtotal * (item.taxRate01 * 0.01 + 1));
            });
        }
        this.totalPriceWithTax = Math.floor(this.totalPriceWithTax);
        console.log('this.totalPriceWithTax3:' + this.totalPriceWithTax);
    }

    getPaymentMethod() {
        return this.paymentMethod;
    }

    payCash() {
        this.paymentMethod = 'cash';
    }


    payCredit() {
        this.paymentMethod = 'credit';
    }

    payIC() {
        this.paymentMethod = 'ic';
    }

    payQR() {
        this.paymentMethod = 'qr';
    }

    getReadValueMethod() {
        return this.readValueMethod;
    }

    setReadValueMethod(method: string) {
        this.readValueMethod = method;
    }

    getFullFeaturedWorker() {
        this.FullFeaturedWorker = null;
        // this.FullFeaturedWorker = new Worker('../assets/js/vescajs-fullfeaturedws.js');
        console.log('FullFeaturedWorker:' + this.FullFeaturedWorker);
        console.log(typeof (Worker));
        console.log(this.FullFeaturedWorker == null);

    }

    browserCheck() {
        if (window.WebSocket && typeof (Worker) !== 'undefined') {
            this.checkMsg = '※このブラウザは、FullFeatured-WSをご利用いただけます。';
        } else {
            this.checkMsg = '※このブラウザは、FullFeatured-WSをご利用いただけません。';
        }

        console.log(this.checkMsg);
    }


    vescaInit() {
        return new Promise(async resolve => {

            // window.addEventListener('load', async () => {
            if (typeof (Worker) !== 'undefined') {
                // VescaJS FullFeatured-WSの初期化。Workerにvescajs-fullfeaturedws.jsを指定します。
                if (this.FullFeaturedWorker == null) {
                    try {
                        this.FullFeaturedWorker = new Worker('../assets/js/vescajs-fullfeaturedws.js');
                        console.log('success');
                        console.log('for test:' + String(this.FullFeaturedWorker));
                        this.getTotal();
                        await this.getDateAndStorage().then(res => console.log('sequenceNumber:' + res));
                        console.log('this.sequenceNumber' + this.sequenceNumber);

                        console.log('this.totalPrice:' + this.totalPrice);
                        console.log('this.totalPricetype:' + typeof (this.totalPrice));
                        console.log('this.totalPriceWithTax:' + this.totalPriceWithTax);

                        console.log('buytype()' + this.cartService.getBuyType());

                        resolve(this.FullFeaturedWorker);
                    } catch (e) {
                        // ブラウザからfile:///呼び出しで実行した場合、CORS policyでBlockingされる場合は、
                        // ブラウザの起動オプションや開発者設定でBlocking制約を無効化してから実行してください。
                        // chrome.exe --allow-file-access-from-files --disable-web-security
                        // --user-data-dir --disable-features=CrossSiteDocumentBlockingIfIsolating
                        // this.showResult('CORSError', 'alert-danger');
                        return;
                    }
                    // VescaJS FullFeatured-WSの取引実行結果の取得処理をonmessageに設定
                    // !!! この設定を行わないと実行結果を受け取る受け取ることができません !!!
                    this.FullFeaturedWorker.onmessage = (e) => {
                        // 結果情報を取得
                        if (this.paymentMethod === 'report') {
                            this.onFinishedReport(e.data);
                        } else {
                            console.log('for test e:' + JSON.stringify(e));
                            console.log('for test e.data:' + JSON.stringify(e.data));
                            this.onFinished(e.data);
                        }
                        // resolve(e.data);
                        console.log('onmessage!!!');
                        // if (this.toErrorPage === true){
                        //   console.log('toErrorPage called');
                        //   this.router.navigateByUrl('payment-menu/payment-error');
                        // }
                    };
                    console.log(this.FullFeaturedWorker.onmessage);
                    // VescaJS FullFeatured-WS実行時のWorkerプロセス自体のエラーハンドリング処理をonerrorに設定
                    // !!! 基本的にはonmessageに遷移しますが、Workerプロセスの異常発生時を考慮し実装することを推奨します!!!!
                    // jsファイル読み取り時に呼ばれるケースがあるため、意味のない情報がきた場合はハンドリングする必要はありません。
                    this.FullFeaturedWorker.onerror = (e) => {
                        e.preventDefault();
                        console.log('onerror test:' + e);


                        if (e.data == null || e.lineno == null) {
                            return;
                        }
                        // this.showResult('Error:Worker', 'alert-danger');
                    };
                }
                // resolve(FullFeaturedWorker);
            }

            // });
        });


    }

    async doMaintenance(command) {
        if (this.FullFeaturedWorker == null) {
            console.error('Worker is null');
            return;
        }

        this.host = await this.onGetClick('catIP');

        if (command === 'printRetry') {
            this.request = {
                PrintRetry: {
                    SequenceNumber: this.sequenceNumber,
                    CurrentService: 'All',
                    // TrainingMode: false,
                    TrainingMode: this.trainingMode,
                    AdditionalSecurityInformation: {}
                }
            };
        } else if (command === 'readValue') {
            this.request = {
                ReadValue: {
                    SequenceNumber: this.sequenceNumber,
                    CurrentService: 'Suica',
                    // TrainingMode: false,
                    TrainingMode: this.trainingMode,
                    AdditionalSecurityInformation: {
                        termDealNumber: 123456
                    }
                }
            };
        }
        console.log(this.request);
        this.doRequestWorker(
            this.host,
            this.port,
            this.request);
    }


    async doRequest(code?) {

        // return new Promise (resolve => {
        // FullFeaturedWorker変数が初期化されていない場合、実行できません。
        if (this.FullFeaturedWorker == null) {
            // this.showResult('CORSError', 'alert-danger');
            console.error('Worker is null');
            return;
        }
        // this.FullFeaturedWorkerに渡す決済情報の取得サンプル。（取得方法は実装依存）
        //
        // host, portは接続先端末のIP Addressとportを指定してください。
        // このサンプルのように手入力を不要とし、jsonプロパティに持つ、htmlに埋め込むなど、
        // 毎回の入力はしない方法や、容易に画面から情報を参照できない方法を検討してください。

        this.host = await this.onGetClick('catIP');

        // request は、JSONフォーマットのリクエストデータを指定してください。
        if (this.paymentMethod === 'ic') {
            this.request = {
                SubtractValue: {
                    SequenceNumber: this.sequenceNumber,
                    CurrentService: 'Suica',
                    Amount: this.totalPriceWithTax,
                    TrainingMode: this.trainingMode,
                    AdditionalSecurityInformation: {
                        lang: 'ja'
                    }
                }
            };
        } else if (this.paymentMethod === 'credit') {
            this.request = {
                AuthorizeSales: {
                    SequenceNumber: this.sequenceNumber,
                    CurrentService: 'Credit',
                    Amount: this.totalPriceWithTax,
                    TaxOthers: 0,
                    TrainingMode: this.trainingMode,
                    // TrainingMode: false,
                    AdditionalSecurityInformation: {
                        lang: 'ja'
                    }
                }
            };
        } else if (this.paymentMethod === 'qr') {
            this.request = {
                SubtractValue: {
                    SequenceNumber: this.sequenceNumber,
                    CurrentService: 'QRPayment',
                    Amount: this.totalPriceWithTax,
                    TrainingMode: this.trainingMode,
                    AdditionalSecurityInformation: {
                        qrCodeMode: 'CPM',
                        qrCode: code,
                        validTime: 5
                    }
                }
            };
        }
        // response用のViewをリセット
        // responseJsonView.set({});
        // サンプル実行中に実行できないボタン等を無効化
        // setProcessingStatus(true);
        // VescaJS FullFeatured-WSモジュールに、jsonパラメータで決済指示を送ります。
        // トランザクションは、Web Worker Threadで実行されます。
        // 結果は、this.FullFeaturedWorker.onmessageに指定したfunctionで受け取ります。
        this.doRequestWorker(
            this.host,
            this.port,
            this.request);
        console.log('this.sequenceNumber2' + this.sequenceNumber);
        console.log('request:' + JSON.stringify(this.request));
        console.log('Start worker');
    }

    dailyReport() {
        return new Promise( async resolve => {
            if (this.FullFeaturedWorker == null) {
                console.error('Worker is null');
                return;
            }
            this.host = await this.onGetClick('catIP');

            this.request = {
                AccessDailyLog: {
                    SequenceNumber: 1,
                    Type: 2,
                    CurrentService: 'All',
                    TrainingMode: this.trainingMode,
                    // TrainingMode: false,
                    AdditionalSecurityInformation: {
                        Type: 1
                    }
                }
            };

            console.log('request daily report:' + JSON.stringify(this.request));

            this.doRequestWorker(
                this.host,
                this.port,
                this.request);

            resolve(this.FullFeaturedWorker.onmessage);
            this.modalCtrl.dismiss();

        });

    }

    async midReport() {
        if (this.FullFeaturedWorker == null) {
            console.error('Worker is null');
            return;
        }
        this.host = await this.onGetClick('catIP');

        this.request = {
            AccessDailyLog: {
                SequenceNumber: 1,
                Type: 1,
                CurrentService: 'All',
                TrainingMode: this.trainingMode,
                // TrainingMode: false,
                AdditionalSecurityInformation: {
                    Type: 1
                }
            }
        };

        console.log('request mid report:' + JSON.stringify(this.request));
        console.log('port:' + this.port);
        console.log('host:' + JSON.stringify(this.host));


        this.doRequestWorker(
            this.host,
            this.port,
            this.request);

    }


    doRequestWorker(
        host,
        port,
        request) {

        this.FullFeaturedWorker.postMessage({
            host,       // Terminal IP Address
            port,       // Terminal Port
            request     // request JSON
        });
    }

    doCancelWorker() {
        if (this.FullFeaturedWorker == null) {
            return;
        }
        this.isCancelled = true;
        this.FullFeaturedWorker.postMessage({
            request: {Cancel: true}
        });
        console.log('cancel worker called!!');
    }


    async onFinishedReport(data) {
        if (data == null) {
            console.log('data == null');
        } else {
            console.log('onFinishedReport:' + JSON.stringify(data));

            if (data.OutputCompleteEvent != null) {

                // console.log('outputCompleteEvent' + )
                this.merchantReceipt = await data.OutputCompleteEvent.MerchantReceipt;
                console.log('merchantReceipt:' + JSON.stringify(this.merchantReceipt));
                this.openReportModal();

            } else if (data.ErrorEvent != null) {
                console.log('report error');
            }
        }
    }

    async openReportModal() {
        const modal = await this.modalCtrl.create({
            component: ReportModalPage,
            cssClass: 'report-modal'
        });
        modal.present();
    }


    onFinished(data) {
        return new Promise(resolve => {
            // setProcessingStatus(false);
            if (data == null) {
                // responseJsonView.set({});
                console.log('data == null');
            } else {
                // responseJsonView.set(data);
                console.log(data);
                console.log('onFinished:' + JSON.stringify(data));
                // console.log('data[0]:' + data[0]);
                // 取引成立
                if (data.OutputCompleteEvent != null) {
                    // このサンプルでは、画面で決済成立のalert表示のみを行います。
                    // this.showResult('Approved', 'alert-success');
                    console.log('Approved');
                    console.log('OutputCompleteEvent:' + data.OutputCompleteEvent);
                    console.log('OutputCompleteEventString:' + JSON.stringify(data.OutputCompleteEvent));
                    this.outputJson = data.OutputCompleteEvent;
                    if (typeof data.OutputCompleteEvent.CustomerReceipt !== 'undefined') {
                        this.customerReceipt = data.OutputCompleteEvent.CustomerReceipt;
                        console.log(this.customerReceipt);

                        this.router.navigateByUrl('payment-menu/payment-success');
                    } else {
                        // 残高取得
                        this.readValue = Number(JSON.stringify(data.OutputCompleteEvent.Balance));
                        console.log('No customer receipt.');
                        console.log(this.readValueMethod);
                        console.log(this.readValue);
                        if (this.readValueMethod === 'payment-ic') {
                            // 支払い方法選択画面から残高照会
                            this.router.navigateByUrl('payment-menu/payment-ic/read-value');
                        } else {
                            // メンテナンスモードから残高照会
                            this.router.navigateByUrl('payment-menu/payment-error/read-value');
                        }
                    }


                    // 取引不成立もしくは、キャンセル
                } else if (data.ErrorEvent != null) {
                    // this.showResult(data.ErrorEvent.Errorcodedetail, 'alert-warning');
                    // if (this.isCancelled === true) {
                    //     this.router.navigateByUrl('payment-menu');
                    //     return;
                    // }

                    console.log('Code:' + data.ErrorEvent.Errorcodedetail);
                    console.log('Message:' + data.ErrorEvent.Message);
                    this.resCode = data.ErrorEvent.Errorcodedetail;
                    this.errorMessage = data.ErrorEvent.Message.replace(/ *\[[^)]*\] /g, '');

                    this.toErrorPage = true;
                    if (this.paymentMethod === 'ic') {
                        if (this.resCode === 'TF05-404') {
                            this.errorMessage = 'タイムアウトが発生しました。';
                        } else if (this.resCode === 'TF05-803') {
                            this.errorMessage = '処理未了エラーが発生しました。所定の操作を行ってください。';
                            this.toErrorPage = false;
                            this.toMaintenancePage = true;
                            this.isCancelled = false;
                            this.customerReceipt = data.ErrorEvent.MerchantReceipt;
                            console.log('response code: ' + this.resCode);
                            console.log('customerReceipt' + this.customerReceipt);
                        } else if (
                            this.resCode === 'TF05-205' ||
                            this.resCode === 'TF05-301' ||
                            this.resCode === 'TF05-303' ||
                            this.resCode === 'TF05-901') {
                            this.errorMessage = '決済処理中にエラーが発生しました。エラー詳細については端末画面をご確認下さい。';
                            this.toErrorPage = false;
                            this.toMaintenancePage = true;
                            this.isCancelled = false;
                            this.customerReceipt = data.ErrorEvent.MerchantReceipt;
                            console.log('response code: ' + this.resCode);
                            console.log('customerReceipt' + this.customerReceipt);

                        }

                        if (data.ErrorEvent.ResponseCode === '0140') {
                            this.doMaintenance('printRetry');
                            this.toErrorPage = false;
                            console.log('0140 called!!');
                        }
                    }

                    if (this.isCancelled === true) {
                        this.router.navigateByUrl('payment-menu');
                        return;
                    }


                    console.log('errormessage' + this.errorMessage);
                    resolve(this.toErrorPage);

                    // switch (this.resCode){
                    //   case '"VTB"':
                    //   case '"VTK"':
                    //   case '"VTL"':
                    //   case '"VTM"':
                    //   case '"VTP"':
                    //   case '"I01"':
                    //   case '"I02"':
                    //   case '"I04"':
                    //   case '"I17"':
                    //   case '"I23"':
                    //   case '"I24"':
                    //   case '"I30"':
                    //   case '"J01"':
                    //   case '"J04"':
                    //   case '"J11"':
                    //   case '"J16"':
                    //   case '"J29"':
                    //   case '"J16"':
                    //   case '"G14"':
                    //   case '"G15"':
                    //   case '"G16"':
                    //   case '"G17"':
                    //   case '"G18"':
                    //   case '"VT0"':
                    //   case '"VT1"':
                    //   case '"VT2"':
                    //   case '"VT3"':
                    //   case '"VT4"':
                    //   case '"VT5"':
                    //   case '"VT8"':
                    //   case '"VT9"':
                    //   case '""':
                    //   case '""':
                    //   case '""':
                    //   case '""':
                    //   case '""':
                    //     const resCode2 = '[' + this.resCode.replace(/"/g, '') + ']';
                    //     this.errorMessage = JSON.stringify(data.ErrorEvent.Message).replace(resCode2, '');

                    //     console.log('errormessage' + this.errorMessage);
                    //     console.log('J04成功');
                    //     this.toErrorPage = true;
                    //     resolve(this.toErrorPage);

                    //     break;
                    // }

                    if (this.toErrorPage === true) {
                        console.log('toErrorPage called');
                        this.router.navigateByUrl('payment-menu/payment-error');
                    } else if (this.toMaintenancePage === true) {
                        console.log('toMaintenancePage called');
                        this.router.navigateByUrl('payment-menu/payment-error/error-maintenance');
                    }

                    // その他の予期せぬエラーの場合
                } else {
                    // this.showResult('Fatal', 'alert-danger');
                    console.log('Fatal');
                }
            }
        });
    }
}
