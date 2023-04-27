import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { CouponService } from 'src/app/services/coupon.service';
import { EatinMessagePage } from '../../pages/eatin-message/eatin-message.page';
// import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';

// eatinかtakeoutを選択する画面です。

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  storageText: string;
  printerNum: any;
  serialNum: any;
  coupons: any;
  couponList = [];
  headClass: string;

  constructor(
      public router: Router,
      public storage: Storage,
      public modalCtrl: ModalController,
      public cartService: CartService,
      public paymentService: PaymentService,
      public couponService: CouponService) { }

  async ngOnInit() {
    this.headClass = this.paymentService.trainingMode ? 'training' : '';

    this.cartService.removeCart();
    this.storageText = 'storage test!!';

    this.printerNum = await this.onGetClick('printerNum');
    console.log('printerNum', this.printerNum);
    this.serialNum = await this.onGetClick('serialNum');
    console.log('serialNum', this.serialNum);

    if (this.printerNum === null){
      this.onSetClick('printerNum', '01');
    }
    if (this.serialNum === null){
      this.onSetClick('serialNum', '0001');
    }

    this.coupons = await this.couponService.getCoupon();
    // this.cartCoupon = this.couponService.getCartCoupon();
    const today = new Date()
    // test date ↓
    // const today = new Date("2021-04-01 00:00:00")
    console.log('today:' +  today)

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

  }

  pushPage(url){
    this.router.navigateByUrl(url);
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
    }else {
      this.router.navigateByUrl('coupon-home')
    }

  }

  // onSetClick(){
  //   console.log('onSetClick() called ' + this.storageText);
  //   this.storage.set('key1', this.storageText);
  // }

  // onGetClick(){
  //   console.log('onGetClick() called');
  //   this.storage.get('key1')
  //     .then((t) => {
  //       this.storageText = t;
  //     })
  //     .catch((err) => {
  //       this.storageText = `Error ${err}`;
  //     });
  // }
  onSetClick(key, value){
    console.log(`onSetClick(${key}, ${value}) called`);
    this.storage.set(key, value)
        .then((val) => { console.log(val); })
        .catch((err) => { console.log(err); });
  }

  onGetClick(key) {
    console.log(`onGetClick(${key}) called`);
    return new Promise(resolve => {
      this.storage.get(key).then(data => {
            resolve(data);
            console.log('onGetClick:' + data);
          },
          err => {
            console.log(err);
          });
    });
  }

  backToSettings(){
    this.router.navigateByUrl('settings');
  }

  async openEatinMessage(){
    const modal = await this.modalCtrl.create({
      component: EatinMessagePage,
      cssClass: 'alert-message'
    });
    return await modal.present();
  }
}
