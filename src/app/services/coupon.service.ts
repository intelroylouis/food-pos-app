import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

const headers = new HttpHeaders({
  'x-api-key': environment.apiToken,
});

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private cartCoupon = [];
  private cartCouponCount = new BehaviorSubject(0);


  constructor(public http: HttpClient) { }

  getCoupon = () => {
    return new Promise(resolve => {
      this.http.get(environment.apiUrl + '/coupon', {headers}).subscribe(data => {
      resolve(data); },
      err => {
      console.log(err);
      });
    });
  }

  getCartCoupon(){
    return this.cartCoupon;
  }

  addCoupon(coupon){
    let added = false;
    for (const p of this.cartCoupon){
      if (p.id === coupon.id){
        p.amount += 1;
        added = true;
        break;
      }
    }
    if (!added){
      this.cartCoupon.push(coupon);
    }
    this.cartCouponCount.next(this.cartCouponCount.value + 1);
  }

  decreaseCoupon(product){
    for (const [index, p] of this.cartCoupon.entries()){
      if (p.id === product.id){
        p.amount -= 1;
        if (p.amount === 0){
          this.cartCoupon.splice(index, 1);
          p.amount = 1;
        }
      }
    }
    this.cartCouponCount.next(this.cartCouponCount.value - 1);
  }

  removeCoupon(product){
    for (const [index, p] of this.cartCoupon.entries()){
      if (p.id === product.id){
        this.cartCouponCount.next(this.cartCouponCount.value - p.amount);
        this.cartCoupon.splice(index, 1);
        p.amount = 1;
      }
    }
  }

  removeCartCoupon(){
    this.cartCoupon.length = 0;
    this.cartCouponCount.next(0);
  }






}
