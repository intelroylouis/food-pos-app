import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-maintenance-menu',
  templateUrl: './maintenance-menu.page.html',
  styleUrls: ['./maintenance-menu.page.scss'],
})
export class MaintenanceMenuPage implements OnInit {

  constructor(public paymentService: PaymentService, public router: Router) { }

  ngOnInit() {
  }

  readValue(){
    this.router.navigateByUrl('payment-menu/payment-error/read-value-wait');
  }

  printRetry(){
    console.log('printRetry called in maintenance menu !');
    this.paymentService.doMaintenance('printRetry');
  }

}
