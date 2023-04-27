import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PrintService } from '../../services/print.service';

// 日計や中間計の取得成功画面。（requestのコードはpayment.service.tsに、
// 印刷のコードはprint.service.tsに記載。）


@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.page.html',
  styleUrls: ['./report-modal.page.scss'],
})
export class ReportModalPage implements OnInit {

  constructor(private modalCtrl: ModalController, private router: Router, private printService: PrintService) { }

  async ngOnInit() {
    console.log('report modal called!');
    this.printService.receiptForReport();


    await this.sleep(5000);
    this.modalCtrl.dismiss();
    console.log('modal closed!');

  }

  sleep = msec => new Promise(resolve => setTimeout(resolve, msec));


}
