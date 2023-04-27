import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import {PaymentService} from '../services/payment.service';
declare var epson: any;

/**
 * 決済方法選択画面です。
 */
@Component({
  selector: 'app-payment-menu',
  templateUrl: './payment-menu.page.html',
  styleUrls: ['./payment-menu.page.scss'],
})
export class PaymentMenuPage implements OnInit {
  headClass: string;

  constructor(
      private location: Location,
      private printService: PrintService,
      private cartService: CartService,
      private router: Router,
      public paymentService: PaymentService) { }



  async ngOnInit() {
    this.headClass = this.cartService.getBuyType() === 'takeout' ? 'takeout' : '';
    this.headClass = this.paymentService.trainingMode ? 'training' : this.headClass;
  }


  backToMenu(){
    if (this.cartService.getBuyType() === 'takeout'){
      this.router.navigateByUrl('home/takeout');
    }else{
      this.router.navigateByUrl('home/eatin');
    }
    // this.location.back();
  }

  connectTest(){
    this.printService.connect();

    console.log(this.printService.connect());

  }

  toCashPage(){
    this.router.navigateByUrl('payment-menu/payment-cash');
  }

  toCreditPage(){
    this.router.navigateByUrl('payment-menu/payment-credit');
  }

  toICPage(){
    this.router.navigateByUrl('payment-menu/payment-ic');
  }

  toQRPage(){
    this.router.navigateByUrl('payment-menu/payment-qr');
  }

  toReadValue() {
    this.router.navigateByUrl('payment-menu/read-value-wait');
  }
}
