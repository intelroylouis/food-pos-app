import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../services/coupon.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import {PaymentService} from '../../../services/payment.service';

@Component({
  selector: 'app-coupon-menu',
  templateUrl: './coupon-menu.page.html',
  styleUrls: ['./coupon-menu.page.scss'],
})
export class CouponMenuPage implements OnInit {
  coupons: any;
  couponList = [];
  cartCoupon = [];
  page = 1;
  totalRecords: number;
  headClass: string;

  constructor(
      public couponService: CouponService,
      public cartService: CartService,
      public router: Router,
      public paymentService: PaymentService) { }

  async ngOnInit() {
    this.headClass = this.cartService.getBuyType() === 'takeout' ? 'takeout' : '';
    this.headClass = this.paymentService.trainingMode ? 'training' : this.headClass;
    console.log('includesTest' + [1, 2].includes(21));
    this.coupons = await this.couponService.getCoupon();
    this.cartCoupon = this.couponService.getCartCoupon();
    const today = new Date();
    // test date ↓
    // const today = new Date("2021-04-01 00:00:00")
    console.log('today:' +  today);

    this.coupons.map((test)=>{
      console.log(test.from)
      console.log(typeof(test.from))
      let fromDate = new Date(test.from)
      console.log(today.getTime() > fromDate.getTime())
    })

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
    this.totalRecords = this.couponList.length;
  

  }

  toItemMenu(){
    if(this.cartService.getBuyType()==='takeout'){
      this.router.navigateByUrl('home/takeout')
    }else if(this.cartService.getBuyType()==='eatin'){
      this.router.navigateByUrl('home/eatin')
    }
  }

  decreaseCartCoupon(product){
    if(product.amount === 1){
      let couponCards = (document.getElementsByClassName('coupon-card') as any)
      // (document.getElementsByClassName('coupon-card') as any).disabled = true;
      for(var i = 0; i < couponCards.length; i++){
        couponCards[i].disabled = false;
        console.log(couponCards[i].id)
      }  
    }
    this.couponService.decreaseCoupon(product);
  }

  increaseCartCoupon(product){
    this.couponService.addCoupon(product);
  }

  addToCartCoupon(product){
    this.couponService.addCoupon(product);
    if(product.is_combination === false && product.is_multiple === false){
      let couponCards = (document.getElementsByClassName('coupon-card') as any)
      // (document.getElementsByClassName('coupon-card') as any).disabled = true;
      for(var i = 0; i < couponCards.length; i++){
        couponCards[i].disabled = true;
        console.log(couponCards[i].id)
      }
      // window.onload = function(){
      //   let increaseButtonIdName = 'increase-button-' + product.id;
      //   console.log('increaseButtonIdName' + increaseButtonIdName);
      //   console.log((document.getElementById(increaseButtonIdName) as any));
      //   (document.getElementById(increaseButtonIdName) as any).disabled = true;  
      // };
  
      

    }else if(product.is_combination === false && product.is_multiple === true){
      let couponCards = (document.getElementsByClassName('coupon-card') as any)
      let couponIdName = 'coupon-' + product.id;
      for(var i = 0; i < couponCards.length; i++){
        if(couponIdName !== couponCards[i].id){
          couponCards[i].disabled = true;
        }
        console.log(couponCards[i].id)
      }
    }else if(product.is_combination === true && product.is_multiple === false){
      let couponCards = (document.getElementsByClassName('coupon-card') as any)
      let couponIdName = 'coupon-' + product.id;
      for(var i = 0; i < couponCards.length; i++){
        let couponId = Number(couponCards[i].id.replace('coupon-', ''));
        console.log('couponId' + couponId);
        let theCoupon = this.couponList.filter((coupon) =>{
          if(couponId === coupon.id){
            return true;
          };
        })
        console.log('theCoupon[0]' + JSON.stringify(theCoupon[0]))

        if(couponIdName === couponCards[i].id || theCoupon[0].is_combination === false){
          couponCards[i].disabled = true;
        }
        console.log(couponCards[i].id)
      }

    }else if(product.is_combination === true && product.is_multiple === true){
      let couponCards = (document.getElementsByClassName('coupon-card') as any)
      // let couponIdName = 'coupon-' + product.id;
      for(var i = 0; i < couponCards.length; i++){
        let couponId = Number(couponCards[i].id.replace('coupon-', ''));
        console.log('couponId' + couponId);
        let theCoupon = this.couponList.filter((coupon) =>{
          if(couponId === coupon.id){
            return true;
          };
        })
        console.log('theCoupon[0]' + JSON.stringify(theCoupon[0]))

        if(theCoupon[0].is_combination === false){
          couponCards[i].disabled = true;
        }
        console.log(couponCards[i].id)
        
      }

    }
    // let increaseButtonIdName = 'increase-button-' + product.id;
    // console.log('increaseButtonIdName' + increaseButtonIdName);
    // console.log((document.getElementById(increaseButtonIdName) as any));
    // (document.getElementById(increaseButtonIdName) as any).disabled = true;

  }

  removeCartCoupon(product){
    this.couponService.removeCoupon(product);
    console.log('cartCoupon.length' + this.cartCoupon.length);
    let couponCards = (document.getElementsByClassName('coupon-card') as any)
    let couponIdName = 'coupon-' + product.id;
    // (document.getElementsByClassName('coupon-card') as any).disabled = true;
    if(this.cartCoupon.length === 0){
      for(var i = 0; i < couponCards.length; i++){
        couponCards[i].disabled = false;
        console.log(couponCards[i].id)
      }
    }
    (document.getElementById(couponIdName) as any).disabled = false;

  }

  couponCancel(){
    this.couponService.removeCartCoupon();

    this.router.navigateByUrl('welcome');
  }




}
