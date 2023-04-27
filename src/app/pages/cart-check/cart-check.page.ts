import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/services/cart.service';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-cart-check',
  templateUrl: './cart-check.page.html',
  styleUrls: ['./cart-check.page.scss'],
})
export class CartCheckPage implements OnInit {

  cart: Product[] = [];
  cartCoupon = [];
  cartPriceSorted = [];
  buyType: any;

  constructor(private cartService: CartService, private couponService: CouponService) { }

  ngOnInit() {

    this.cart = this.cartService.getCart();
    this.cartCoupon = this.couponService.getCartCoupon();

    this.buyType = this.cartService.getBuyType();
    console.log('buytype:', this.buyType);
  }

  getTotalMinusCoupon(){
    let totalMinusCoupon = 0;
    // let totalMinusCoupon = this.getTotal();
    this.cartPriceSorted = this.cartService.getCartPriceSorted();

    if(this.cartCoupon.length === 0){
      this.cartPriceSorted.map(item =>{
        // item.subtotal = this.urlId === '/home/takeout'? item.price02 * item.amount : item.price01 * item.amount;
        item.subtotal = this.buyType === 'takeout'? item.price02 * item.amount : item.price01 * item.amount;
        item.discount_price = 0;
      })
    }
    
    this.cartCoupon.map((coupon) => {
      let totalDiscountPrice = coupon.discount_price * coupon.amount;
      this.cartPriceSorted.map(item =>{
        if(coupon.target.includes(item.id)){
          // if(this.urlId === '/home/takeout'){
          if(this.buyType === 'takeout'){
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
          // item.subtotal = this.urlId === '/home/takeout'? item.price02 * item.amount : item.price01 * item.amount
          item.subtotal = this.buyType === 'takeout'? item.price02 * item.amount : item.price01 * item.amount
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
