import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import {PaymentService} from '../../../services/payment.service';

@Component({
  selector: 'app-coupon-home',
  templateUrl: './coupon-home.page.html',
  styleUrls: ['./coupon-home.page.scss'],
})
export class CouponHomePage implements OnInit {
  headClass: string;

  constructor(
      public router: Router,
      public paymentService: PaymentService,
      public cartService: CartService) {}

  ngOnInit() {
    this.headClass = this.cartService.getBuyType() === 'takeout' ? 'takeout' : '';
    this.headClass = this.paymentService.trainingMode ? 'training' : this.headClass;
  }

  // pushPage(url){
  //   this.router.navigateByUrl(url);
  // }

  toItemMenu(){
    if(this.cartService.getBuyType()==='takeout'){
      this.router.navigateByUrl('home/takeout')
    }else if(this.cartService.getBuyType()==='eatin'){
      this.router.navigateByUrl('home/eatin')
    }
  }

  toCouponMenu(){
    this.router.navigateByUrl('coupon-menu');
  }


}
