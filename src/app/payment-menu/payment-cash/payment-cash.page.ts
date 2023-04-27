import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PaymentService} from '../../services/payment.service';
import { CashService} from '../../services/cash.service';
// import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import {CartService} from "../../services/cart.service";

// 釣銭機による支払いページです。


@Component({
  selector: 'app-payment-cash',
  templateUrl: './payment-cash.page.html',
  styleUrls: ['./payment-cash.page.scss'],
})
export class PaymentCashPage implements OnInit {

  totalPayment: number;
  totalPaymentString: any;
  totalPaymentWithTax: number;
  totalPaymentWithTaxString: any;
  depositAmountString: any;
  dispenseAmountString: any;
  testAmount: any;
  headClass: string;

  constructor(
      private location: Location,
      public paymentService: PaymentService,
      public cashService: CashService,
      private cartService: CartService,
      public router: Router) { }

  depositAmount = this.cashService.getDepositAmount();
  dispenseAmount = this.cashService.getDispenseAmount();


  async ngOnInit() {
    this.headClass = this.cartService.getBuyType() === 'takeout' ? 'takeout' : '';
    this.headClass = this.paymentService.trainingMode ? 'training' : this.headClass;

    this.depositAmount.next(0);
    this.dispenseAmount.next(0);

    this.cashService.cashchanger.readCashCounts();

    this.paymentService.payCash();
    this.paymentService.getTotal();
    this.paymentService.getTotalWithTax();
    this.setNumbers();
    // this.totalPaymentString = this.paymentService.totalPrice.toLocaleString();

    // this.cashService.EndDeposit();
    // console.log('between end and start');
    this.cashService.BeginDeposit();
    console.log('after start');
    // this.cashService.ReadCashCounts();
    console.log('this.dispenseAmount.value1' + this.dispenseAmount.value)
    console.log('this.depositAmount.value1' + this.depositAmount.value)

  }

  consoleDeposit(){
    // this.depositAmount = this.cashService.depositAmount;
    console.log('depositAmount2:' + this.depositAmount.value);
  }

  testChange(){
    this.cashService.testChange();
  }

  setNumbers(){
    this.totalPayment = this.paymentService.totalPrice;
    this.totalPaymentString = this.totalPayment.toLocaleString();
    this.totalPaymentWithTax = this.paymentService.totalPriceWithTax;
    this.totalPaymentWithTaxString = this.totalPaymentWithTax.toLocaleString();

    // this.depositAmount = this.cashService.depositAmount;
    // this.depositAmount = 0;
    this.depositAmountString = this.depositAmount.value.toLocaleString();
    // this.dispenseAmount = new BehaviorSubject(0);
    // (this.depositAmount.value - this.totalPayment) < 0 ? this.dispenseAmount.next(0) : this.dispenseAmount.next(this.depositAmount.value - this.totalPayment);
    // (this.depositAmount - this.totalPayment) < 0 ? this.dispenseAmount.next(0) : this.depositAmount - this.totalPayment;

    this.dispenseAmountString = this.dispenseAmount.value.toLocaleString();
  }

  // doCashChanger(){
  //   this.cashService.BeginDeposit();

  // }

  endCashChanger(){
    this.cashService.EndDeposit();
    (document.getElementById('cash-end-button') as any).disabled = true;
    (document.getElementById('cash-cancel-button') as any).disabled = true;
    console.log('this.dispenseAmount.value2' + this.dispenseAmount.value)
    console.log('this.depositAmount.value2' + this.depositAmount.value)

    // this.cashService.DispenseChange(this.dispenseAmount.value);
    // this.cashService.cashchanger.readCashCounts();

    // this.router.navigateByUrl('payment-menu/payment-success');
  }

  endTest(){
    this.cashService.EndDeposit();
  }

  dispenseTest(){
    this.cashService.EndDepositRepay();
  }



  backToPaymentMenu(){
    (document.getElementById('cash-end-button') as any).disabled = true;
    this.cashService.endRepay = true;
    this.cashService.EndDepositRepay();
    // this.location.back();
  }
}
