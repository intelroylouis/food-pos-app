import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {PaymentService} from '../../../services/payment.service';

@Component({
  selector: 'app-read-value-wait',
  templateUrl: './read-value-wait.page.html',
  styleUrls: ['./read-value-wait.page.scss'],
})
export class ReadValueWaitPage implements OnInit {

  constructor(private router: Router, public paymentService: PaymentService) { }

  async ngOnInit() {
    this.paymentService.setReadValueMethod('payment-error');
    this.paymentService.browserCheck();
    this.paymentService.getFullFeaturedWorker();
    await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));
    await this.paymentService.doMaintenance('readValue');
  }

  backToPaymentMenu(){
    this.router.navigateByUrl('payment-menu');
  }
}
