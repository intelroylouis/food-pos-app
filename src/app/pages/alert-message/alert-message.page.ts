import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PaymentService } from '../../services/payment.service';

// 「日計処理は一日一回です」の警告メッセージをモーダル表示します。


@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.page.html',
  styleUrls: ['./alert-message.page.scss'],
})
export class AlertMessagePage implements OnInit {

  constructor(private modalCtrl: ModalController, private paymentService: PaymentService) { }

  ngOnInit() {

  }

  async okReport(){
    this.paymentService.setIsReport();
    this.paymentService.browserCheck();
    this.paymentService.getFullFeaturedWorker();
    await this.paymentService.vescaInit().then(res => console.log('vescaInit():' + res));

    this.paymentService.dailyReport();

    // this.paymentService.openReportModal();

  }

  cancelReport(){
    this.modalCtrl.dismiss();
  }

}
