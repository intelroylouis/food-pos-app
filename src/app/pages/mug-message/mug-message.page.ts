import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router'


@Component({
  selector: 'app-mug-message',
  templateUrl: './mug-message.page.html',
  styleUrls: ['./mug-message.page.scss'],
})
export class MugMessagePage implements OnInit {

  constructor(public cartService: CartService, public router: Router) { }

  ngOnInit() {
    
  }

  orderMug(){
    this.cartService.setOrderMug();
    this.router.navigateByUrl('payment-menu');
  }

  orderPaperCup(){
    this.cartService.setOrderPaperCup();
    this.router.navigateByUrl('payment-menu');
  }

}
