import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CouponService } from 'src/app/services/coupon.service';
import { ModalController } from '@ionic/angular';
import { Product } from '../../services/cart.service';
import { Router } from '@angular/router';

// home.page.htmlのカート画面部分のファイルです。

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {

  cart: Product[] = [];
  cartCoupon = [];
  urlId: string;
  cartPriceSorted = [];

  constructor(private cartService: CartService, private modalCtrl: ModalController, public router: Router, public couponService: CouponService) { }

  ngOnInit() {
    this.cart = this.cartService.getCart();
    this.cartCoupon = this.couponService.getCartCoupon();

    this.urlId = this.router.url;
    console.log('cartmodal called!!!');


    // this.cartPriceSorted = this.cart.slice();
    // this.cartPriceSorted.sort((a,b) => {
    //   if(a.price01<b.price01){
    //     return 1;
    //   }else{
    //     return -1;
    //   }
    // })
    

  }

  decreaseCartItem(product){
    this.cartService.decreaseProduct(product);
  }

  increaseCartItem(product){
    this.cartService.addProduct(product);
  }

  removeCartItem(product){
    this.cartService.removeProduct(product);
  }

  getTotal(){
    if (this.urlId === '/home/takeout'){
      return this.cart.reduce((i, j) => i + j.price02 * j.amount, 0);
    }else{
      return this.cart.reduce((i, j) => i + j.price01 * j.amount, 0);
    }
  }

  getTotalMinusCoupon(){
    let totalMinusCoupon = 0;
    // let totalMinusCoupon = this.getTotal();
    this.cartPriceSorted = this.cartService.getCartPriceSorted();

    if(this.cartCoupon.length === 0){
      this.cartPriceSorted.map(item =>{
        item.subtotal = this.urlId === '/home/takeout'? item.price02 * item.amount : item.price01 * item.amount;
        item.discount_price = 0;
      })
    }
    
    this.cartCoupon.map((coupon) => {
      let totalDiscountPrice = coupon.discount_price * coupon.amount;
      this.cartPriceSorted.map(item =>{
        if(coupon.target.includes(item.id)){
          if(this.urlId === '/home/takeout'){
            if(coupon.is_single === true &&  totalDiscountPrice >= item.price02){
              let subtotal = (item.price02 * item.amount) - item.price02;
              item.discount_price = item.price02;
              totalDiscountPrice = 0
              item.subtotal = subtotal;
            }else{
              let subtotal = (item.price02 * item.amount) - totalDiscountPrice
              if(subtotal < 0){
                totalDiscountPrice = -subtotal
                item.subtotal = 0
                item.discount_price = item.price02 * item.amount
              }else{
                item.discount_price = totalDiscountPrice;
                totalDiscountPrice = 0;
                item.subtotal = subtotal;
              }
            }
          }else{
            if(coupon.is_single === true &&  totalDiscountPrice >= item.price01){
              let subtotal = (item.price01 * item.amount) - item.price01;
              item.discount_price = item.price01;
              totalDiscountPrice = 0
              item.subtotal = subtotal;
            }else{
              let subtotal = (item.price01 * item.amount) - totalDiscountPrice
              if(subtotal < 0){
                totalDiscountPrice = -subtotal
                item.subtotal = 0
                item.discount_price = item.price02 * item.amount
              }else{
                item.discount_price = totalDiscountPrice;
                totalDiscountPrice = 0;
                item.subtotal = subtotal;

              }
            }
          }
        }else{
          item.discount_price = 0
          item.subtotal = this.urlId === '/home/takeout'? item.price02 * item.amount : item.price01 * item.amount
        }
      })
      console.log('totalMinusCoupon'+ totalMinusCoupon)
      
    })
    // if(totalMinusCoupon<0) totalMinusCoupon=0;
    // console.log('minusCoupon!!!');
    console.log('cartPriceSorted:' + JSON.stringify(this.cartPriceSorted));

    this.cartPriceSorted.map(item => {
      totalMinusCoupon += item.subtotal;
    })
    return totalMinusCoupon
  }

  close(){
    this.modalCtrl.dismiss();
  }

  async checkout(){
    // console.log('cartPriceSorted:' + JSON.stringify(this.cartPriceSorted));

    // for(p of this.cart){
    //   this.cartService.removeProduct(p);
    // }
    console.log(`cart: ${this.cart.length}`);
    if (this.cart.length < 1) {
      return false;
    }
    if (this.urlId === '/home/takeout'){
      this.cartService.nextAsTakeout();
    }else{
      this.cartService.nextAsEatin();
    }

    // console.log(this.cartService.getBuyType());

    // Sort Test Code
    console.log('this.cart:' + JSON.stringify(this.cart));
    const category = await this.cartService.getCategory();

    this.cart.map(product => {
      category.map(cat => {
        if (product.categoryId === cat.id){
          product.orderByCategory = cat.orderBy;
        }
      });
    });

    this.cart.sort((a, b) => {
      if (a.orderByCategory !== b.orderByCategory){
        return a.orderByCategory - b.orderByCategory;
      }
      if (a.orderBy !== b.orderBy){
        return a.orderBy - b.orderBy;
      }
      return 0;
    });

    console.log('this.cart2:' + JSON.stringify(this.cart));

    // this.cart.sort((a, b) =>{
    //   if()
    // })

    let isMugCount = 0;
    this.cart.map((item) => {
      if (item.is_mug === true){
        isMugCount += 1;
      }
    });

    if (isMugCount > 0 && this.cartService.getBuyType() === 'eatin'){
      this.router.navigateByUrl('mug-message');
    }else{
      this.router.navigateByUrl('payment-menu');

    }

    // this.router.navigateByUrl('payment-menu');


  }

  isCouponMatched = (coupon) =>{
    if(coupon.target === 'all' && this.cart.length !== 0){
      return true;
    }
    let couponMatched = 0;
    for(var i=0; i< this.cart.length; i++){
      if(coupon.target.includes(this.cart[i].id)){
        couponMatched += 1;
      }
    }
    console.log('couponMatched'+ couponMatched);
    if(couponMatched>=1){
      return true;
    }else{
      return false;
    }
    
  }


}
