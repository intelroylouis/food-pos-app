import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {PaymentService} from '../../../services/payment.service';

@Component({
  selector: 'app-read-value',
  templateUrl: './read-value.page.html',
  styleUrls: ['./read-value.page.scss'],
})
export class ReadValuePage implements OnInit {
  readValue: string;
  constructor(private router: Router, public paymentService: PaymentService) { }

  async ngOnInit() {
    //
    console.log('payment-ic/read-value');
    this.readValue = this.paymentService.readValue.toLocaleString();
    console.log(this.readValue);
  }

  backToPaymentMenu(){
    this.router.navigateByUrl('payment-menu');
  }
}
