import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ModalController } from '@ionic/angular';
import { PrintService } from '../../services/print.service';
import { CartService } from '../../services/cart.service';
import { CouponService } from '../../services/coupon.service';

// 「お席を確保してから、、、」の警告メッセージをポップアップで出します。

@Component({
  selector: 'app-eatin-message',
  templateUrl: './eatin-message.page.html',
  styleUrls: ['./eatin-message.page.scss'],
})
export class EatinMessagePage implements OnInit {

  coupons: any;
  couponList = [];

  constructor(public router: Router, public modalCtrl: ModalController, public printService: PrintService, public cartService: CartService, public couponService: CouponService) { }

  async ngOnInit() {
    this.coupons = await this.couponService.getCoupon();
    // this.cartCoupon = this.couponService.getCartCoupon();
    const today = new Date()

    if (this.coupons){
      this.couponList = this.coupons.filter( coupon => {
        let fromDate = new Date(coupon.from)
        let toDate = new Date(coupon.to)
        if (fromDate.getTime() < today.getTime() && toDate.getTime() > today.getTime()) {
          // console.log(firstCategory);
          return true;
        }
      });
    }else{
      console.log('filter error');
    }

    console.log(this.couponList)


    this.printService.sleep(10000).then(() => {
      this.modalCtrl.dismiss();
    });
  }

  toEatin(){
    this.router.navigateByUrl('home/eatin');
    this.modalCtrl.dismiss();
  }

  toCouponHome(type){
    if (type==='takeout'){
      this.cartService.nextAsTakeout();
    }else if(type==='eatin'){
      this.cartService.nextAsEatin();
    }

    if(this.couponList.length === 0){
      if(this.cartService.getBuyType()==='takeout'){
        this.router.navigateByUrl('home/takeout')
      }else if(this.cartService.getBuyType()==='eatin'){
        this.router.navigateByUrl('home/eatin')
      } 
      this.modalCtrl.dismiss();
    }else {
      this.modalCtrl.dismiss();
      this.router.navigateByUrl('coupon-home')
    }


  }



}
