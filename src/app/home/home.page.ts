import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CouponService } from '../services/coupon.service';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../services/rest.service';
import { Storage } from '@ionic/storage';
import {PaymentService} from "../services/payment.service";

// home.page.htmlのion-split-paneの商品選択画面のtsファイルです。（カート画面はcart-modal.page.ts）

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  cart = [];
  products: any;
  itemList = [];
  categoryList: any;
  totalRecords: number;
  page = 1;
  datarec: string;
  headClass: string;

  cartItemCount: BehaviorSubject<number>;

  @ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

  constructor(
      private cartService: CartService,
      private modalCtrl: ModalController,
      public activeRoute: ActivatedRoute,
      public router: Router,
      public restService: RestService,
      public storage: Storage,
      public paymentService: PaymentService,
      public couponService: CouponService) {}

  // constructor(private router: Router) {}
  async ngOnInit(){
    this.headClass = this.cartService.getBuyType() === 'takeout' ? 'takeout' : '';
    this.headClass = this.paymentService.trainingMode ? 'training' : this.headClass;
    console.log(this.headClass);
    this.cartService.setOrderMug();
    console.log('ngOnInit');

    // this.getJsonProducts();
    const dataJson = await this.cartService.getProducts();
    this.products = dataJson;

    const categoryJson = await this.cartService.getCategory();
    this.categoryList = categoryJson;

    this.categoryList.sort((a, b) => {
      if (a.orderBy > b.orderBy) {
        return 1;
      } else{
        return -1;
      }
    });

    console.log('categoryList2' + JSON.stringify(this.categoryList));

    this.products ? console.log(this.products) : console.log('no products error2') ;
    this.categoryList ? console.log(this.categoryList) : console.log('no categoryList2') ;



    // this.products = this.cartService.getProducts();
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
    // this.categoryList = this.cartService.getCategory();
    const firstCategory = this.categoryList[0].id ;

    this.datarec = this.activeRoute.snapshot.paramMap.get('myid');

    if (this.products){
    this.itemList = this.products.filter( item => {
      if (item.categoryId === firstCategory) {
        // console.log(firstCategory);
        return true;
      }
    });
    }else{
      console.log('filter error');
    }
    this.itemList.sort((a, b) => {
      if (a.orderBy > b.orderBy) {
        return 1;
      } else{
        return -1;
      }
    });
  }

  async getJsonProducts(){
    const dataJson = await this.cartService.getProducts();
    this.products = dataJson;
  }



  async getJsonCategory(){
    console.log('getJsonCategory');
    await this.cartService.getCategory().then(data => {
      this.categoryList = data;
      console.log('getCategory');
      console.log(this.categoryList);

    });
  }

  addToCart(product){
    this.cartService.addProduct(product);
  }

  filterItem(itemCategory){
    this.itemList = this.products.filter( item => {
      if (item.categoryId === itemCategory) {
        return true;
      }
    });
    this.itemList.sort((a, b) => {
      if (a.orderBy > b.orderBy) {
        return 1;
      } else{
        return -1;
      }
    });
    this.totalRecords = this.itemList.length;
    this.page = 1;
  }

  async openCart(){
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }

  orderCancel(){
    this.cartService.removeCart();
    this.couponService.removeCartCoupon();

    this.router.navigateByUrl('welcome');
  }
}
