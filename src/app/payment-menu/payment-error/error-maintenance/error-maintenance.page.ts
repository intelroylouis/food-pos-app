import { Component, OnInit } from '@angular/core';
import { PrintService } from '../../../services/print.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-maintenance',
  templateUrl: './error-maintenance.page.html',
  styleUrls: ['./error-maintenance.page.scss'],
})
export class ErrorMaintenancePage implements OnInit {

  passwordNum: any;

  constructor(public printService: PrintService, public router: Router) { }

  ngOnInit() {
    this.printService.alertToKitchen('処理未了エラーが発生しました。POS画面で残高照会を行ってください。');
  }

  toMaintenanceMenu(){
    this.printService.receiptPayment();
    this.printService.printer.send();
    this.router.navigateByUrl('payment-menu/payment-error/maintenance-menu');
  }

  toMaintenanceMenuPassed(){
    if(this.passwordNum === '1111') this.toMaintenanceMenu()
  }

  passwordNumInput(value){
    if (!this.passwordNum) {
      this.passwordNum = value;
    }else{
      this.passwordNum += value;
    }
    
  }

  passwordClear(){
    this.passwordNum = undefined
  }


}
