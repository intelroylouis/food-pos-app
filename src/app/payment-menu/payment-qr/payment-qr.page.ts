import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PaymentService} from '../../services/payment.service';
import {CartService} from '../../services/cart.service';

// QRによる支払い画面です。

@Component({
  selector: 'app-payment-qr',
  templateUrl: './payment-qr.page.html',
  styleUrls: ['./payment-qr.page.scss'],
})
export class PaymentQrPage implements OnInit {
  qrCode: any;
  totalPayment: any;
  totalPaymentWithTax: any;
  headClass: string;


  constructor(
      private location: Location,
      public paymentService: PaymentService,
      public cartService: CartService) { }

  ngOnInit() {
    this.headClass = this.cartService.getBuyType() === 'takeout' ? 'takeout' : '';
    this.headClass = this.paymentService.trainingMode ? 'training' : this.headClass;
    this.paymentService.getTotal();
    this.totalPayment = this.paymentService.totalPrice.toLocaleString();
    this.paymentService.getTotalWithTax();
    this.totalPaymentWithTax = this.paymentService.totalPriceWithTax.toLocaleString();
    console.log('this.totalPaymentWithTax' + this.totalPaymentWithTax);
    this.qrCode = '';
    console.log('ngOnInit payment-qr.page.ts called');
    window.addEventListener('keydown', this.qrEnter);
  }

  qrEnter = (event) => {
    console.log('keydown event:' + JSON.stringify(event));
    const keyName = event.key;
    console.log('keyName1:' + keyName);
    console.log('eventCodeKeyDown:' + event.code);
    if (keyName === 'Enter') {
      // バーコードの値
      console.log('this.qrCodeEnter:' + this.qrCode);
      // 決済処理
      this.requestQR(this.qrCode);
      // 入力クリア
      this.qrCode = '';
      window.removeEventListener('keydown', this.qrEnter);
    } else {
      // バーコード1桁ごとにイベントが発生するので連結していく
      console.log('keyName2:' + keyName);
      console.log('this.qrCode2:' + keyName);

      this.qrCode += keyName;
      console.log('keyName3:' + keyName);
      console.log('this.qrCode3:' + keyName);
    }

  }

  backToPaymentMenu(){
    this.location.back();
  }

  async requestQR(code){
    console.log('requestQR');
    console.log(code);
    this.paymentService.payQR();
    this.paymentService.browserCheck();
    this.paymentService.getFullFeaturedWorker();
    await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));
    this.paymentService.doRequest(code);
    // await this.paymentService.doRequest(code);
  }

  cancelQr(){
    // this.paymentService.doCancelWorker();
    this.backToPaymentMenu();
  }
}
