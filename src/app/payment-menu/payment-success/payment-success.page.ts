import { Component, OnInit } from '@angular/core';
import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { LogService } from 'src/app/services/log.service';
import { CouponService } from 'src/app/services/coupon.service';
import {PaymentService} from '../../services/payment.service';

// 支払い成功時の画面です。支払い情報の印刷と、情報の保持（jsonオブジェクトとして）を行います。
// 支払い情報の印刷はprint.service.ts、情報の保持はlog.service.tsに記載があります。
@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
})
export class PaymentSuccessPage implements OnInit {
  headClass: string;

  constructor(
      public printService: PrintService,
      public cartService: CartService,
      public router: Router,
      public logService: LogService,
      public couponService: CouponService,
      public paymentService: PaymentService) { }

  async ngOnInit() {
    this.headClass = this.cartService.getBuyType() === 'takeout' ? 'takeout' : '';
    this.headClass = this.paymentService.trainingMode ? 'training' : this.headClass;

    await this.printService.receiptDesign();
    console.log('after Print');
    await this.logService.logJson();
    // this.cartService.removeCart();
    this.printService.sleep(8000).then( () => {
      this.router.navigateByUrl('welcome');
      this.cartService.removeCart();
      this.couponService.removeCartCoupon();
    });
  }

}
