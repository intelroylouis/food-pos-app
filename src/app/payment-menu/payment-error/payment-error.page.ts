import {Component, OnInit} from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {Router} from '@angular/router';

// 決済エラー時の画面です。数秒後自動的に支払い選択画面（payment-menu）に戻ります。

@Component({
    selector: 'app-payment-error',
    templateUrl: './payment-error.page.html',
    styleUrls: ['./payment-error.page.scss'],
})
export class PaymentErrorPage implements OnInit {

    message: any;

    constructor(public paymentService: PaymentService, public router: Router) {
    }

    async ngOnInit() {
        this.message = this.paymentService.errorMessage;
        await this.sleep(8000);
        this.backToPaymentMenu();
    }

    sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

    backToPaymentMenu = () => {
        this.router.navigateByUrl('payment-menu');
    }


}
