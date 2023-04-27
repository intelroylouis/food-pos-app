import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';

// 商品一覧やカートのサービスです。


export interface Product {
  id: number;
  name: string;
  price01: number;
  tax01: number;
  price02: number;
  tax02: number;
  amount: number;
  categoryId: number;
  imageUrl: string;
  orderBy: number;
  orderByCategory?: number;
  is_mug: boolean;
}

export interface Category {
  name: string;
  id: number;
}

const headers = new HttpHeaders({
  'x-api-key': environment.apiToken,
});

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart = [];
  private cartItemCount = new BehaviorSubject(0);
  private buyType: string;
  private orderMug = true;
  public cartPriceSorted = [];

  constructor(public http: HttpClient) {}

  getOrderMug(){
    return this.orderMug;
  }

  setOrderMug(){
    this.orderMug = true;
  }

  setOrderPaperCup(){
    this.orderMug = false;
  }

  getProducts = () => {
    return new Promise(resolve => {
      this.http.get(environment.apiUrl + '/products', {headers}).subscribe(data => {
      resolve(data); },
      err => {
      console.log(err);
      });
    });
  }

  getCategory(): any{
    return new Promise(resolve => {
      this.http.get(environment.apiUrl + '/category', {headers}).subscribe(data => {
      resolve(data); },
      err => {
      console.log(err);
      });
    });
  }

  nextAsEatin(){
    this.buyType = 'eatin';
  }

  nextAsTakeout(){
    this.buyType = 'takeout';
  }

  getBuyType(){
    return this.buyType;
  }

  // getCategory(){
  //   return this.category;
  // }

  // getProducts(){
  //   return this.data;
  // }

  getCart(){
    return this.cart;
  }

  getCartPriceSorted(){
    this.cartPriceSorted = this.cart.slice();
    if (this.buyType === 'takeout'){
      this.cartPriceSorted.sort((a,b) => {
        if(a.price02<b.price02){
          return 1;
        }else{
          return -1;
        }
      })
    }else{
      this.cartPriceSorted.sort((a,b) => {
        if(a.price01<b.price01){
          return 1;
        }else{
          return -1;
        }
      })  
    }
    return this.cartPriceSorted;
  }

  getCartItemCount(){
    return this.cartItemCount;
  }

  addProduct(product){
    let added = false;
    for (const p of this.cart){
      if (p.id === product.id){
        p.amount += 1;
        added = true;
        break;
      }
    }
    if (!added){
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);

  }

  decreaseProduct(product){
    for (const [index, p] of this.cart.entries()){
      if (p.id === product.id){
        p.amount -= 1;
        if (p.amount === 0){
          this.cart.splice(index, 1);
          p.amount = 1;
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }

  removeProduct(product){
    for (const [index, p] of this.cart.entries()){
      if (p.id === product.id){
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
        p.amount = 1;
      }
    }
  }

  removeCart(){
    this.cart.length = 0;
    this.cartItemCount.next(0);
  }
}
