import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { PrintService } from '../../../services/print.service';
import { LogService } from '../../../services/log.service';
import {PaymentService} from '../../../services/payment.service';

@Component({
  selector: 'app-read-value',
  templateUrl: './read-value.page.html',
  styleUrls: ['./read-value.page.scss'],
})
export class ReadValuePage implements OnInit {
  readValue: string;
  constructor(public cartService: CartService, public router: Router, public printService: PrintService, public logService: LogService, public paymentService: PaymentService) { }

  ngOnInit() {
    this.readValue = this.paymentService.readValue.toLocaleString();
  }

  successPayment = async () => {
    this.printService.readValue = true;
    await this.printService.receiptDesign();
    console.log('success payment');
    await this.logService.logJson();
    this.cartService.removeCart();
    this.router.navigateByUrl('welcome');
  }

  errorPayment = () => {
    this.cartService.removeCart();
    this.router.navigateByUrl('welcome');
  }
}
