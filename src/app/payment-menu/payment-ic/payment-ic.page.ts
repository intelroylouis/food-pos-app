import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PaymentService} from '../../services/payment.service';
import {CartService} from '../../services/cart.service';

// ICによる支払い画面です。

@Component({
  selector: 'app-payment-ic',
  templateUrl: './payment-ic.page.html',
  styleUrls: ['./payment-ic.page.scss'],
})
export class PaymentIcPage implements OnInit {
  totalPayment: any;
  totalPaymentWithTax: any;
  headClass: string;

  constructor(
      private location: Location,
      public paymentService: PaymentService,
      public cartService: CartService) {}

  async ngOnInit() {
    this.headClass = this.cartService.getBuyType() === 'takeout' ? 'takeout' : '';
    this.headClass = this.paymentService.trainingMode ? 'training' : this.headClass;

    this.paymentService.getTotal();
    this.totalPayment = this.paymentService.totalPrice.toLocaleString();
    this.paymentService.getTotalWithTax();
    this.totalPaymentWithTax = this.paymentService.totalPriceWithTax.toLocaleString();

    this.paymentService.payIC();
    this.paymentService.browserCheck();
    this.paymentService.getFullFeaturedWorker();
    await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));
    console.log('hey');
    this.paymentService.doRequest();
  }

  async paymentTest(){
    this.paymentService.payIC();
    this.paymentService.browserCheck();
    this.paymentService.getFullFeaturedWorker();
    await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));
    console.log('hey');
    this.paymentService.doRequest();
    console.log('paymentTest');
    

  }

  cancelIC(){
    this.paymentService.doCancelWorker();
    // this.backToPaymentMenu();
  }

  backToPaymentMenu(){
    this.location.back();
  }
}
