import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PaymentService} from '../../services/payment.service';
import { CartService} from '../../services/cart.service';
import { Router } from '@angular/router';

// クレジットによる支払いページです。

@Component({
  selector: 'app-payment-credit',
  templateUrl: './payment-credit.page.html',
  styleUrls: ['./payment-credit.page.scss'],
})
export class PaymentCreditPage implements OnInit {
  totalPayment: any;
  totalPaymentWithTax: any;
  headClass: string;

  constructor(
      private location: Location,
      public paymentService: PaymentService,
      public cartService: CartService,
      public router: Router) {}

  async ngOnInit() {
    this.headClass = this.cartService.getBuyType() === 'takeout' ? 'takeout' : '';
    this.headClass = this.paymentService.trainingMode ? 'training' : this.headClass;

    this.paymentService.getTotal();
    this.totalPayment = this.paymentService.totalPrice.toLocaleString();
    this.paymentService.getTotalWithTax();
    this.totalPaymentWithTax = this.paymentService.totalPriceWithTax.toLocaleString();

    this.paymentService.payCredit();
    this.paymentService.browserCheck();
    this.paymentService.getFullFeaturedWorker();
    await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));
    console.log('hey');
    this.paymentService.doRequest();
    console.log('hey2');
  }

  async testCredit(){
    this.paymentService.payCredit();
    this.paymentService.browserCheck();
    this.paymentService.getFullFeaturedWorker();
    await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));
    console.log('hey');
    this.paymentService.doRequest();
    console.log('hey2');
  }

  // testRouter(){
  //   this.router.navigateByUrl('payment-menu/payment-error');
  // }

  backToPaymentMenu(){
    this.location.back();
  }

  cancelCredit(){
    this.paymentService.doCancelWorker();
    // this.backToPaymentMenu();
  }
}
