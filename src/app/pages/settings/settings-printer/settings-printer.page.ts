import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

// プリンター情報の設定画面。情報はionic storageに保存（キャッシュクリアしなければ保持される）。

@Component({
  selector: 'app-settings-printer',
  templateUrl: './settings-printer.page.html',
  styleUrls: ['./settings-printer.page.scss'],
})
export class SettingsPrinterPage implements OnInit {

  printerNum: string;
  serialNum: string;
  kitchenPrinterIP: string;
  catIP: string;

  // amountLimit = [...Array(100).keys()].map(i => ++i);
  amountLimit = [...Array(101).keys()];

  oneAmount: number;
  fiveAmount: number;
  tenAmount: number;
  fiftyAmount: number;
  hundredAmount: number;
  fiveHundredAmount: number;
  thousandAmount: number;
  fiveThousandAmount: number;
  tenThousandAmount: number;

  nameList: object;



  constructor(public storage: Storage, public router: Router) { }

  ngOnInit(){
    // this.nameList = {
    //   1: this.oneAmount,
    //   5: this.fiveAmount,
    //   10: this.tenAmount,
    // };

    // console.log(this.nameList);
  }

  // setLimitArray(){
  //   const limitArray = [];
  //   for (const limit of Object.keys(this.nameList)){
  //     limitArray.push(this.nameList[limit]);
  //   }
  //   console.log('onSetClick() called ' + limitArray);
  //   this.storage.set('不足金額設定', limitArray);

  // }

  setLimitArray(){
    const limitObject = {
      '1円': this.oneAmount,
      '5円': this.fiveAmount,
      '10円': this.tenAmount,
      '50円': this.fiftyAmount,
      '100円': this.hundredAmount,
      '500円': this.fiveHundredAmount,
      '1000円': this.thousandAmount,
      '5000円': this.fiveThousandAmount,
      '10000円': this.tenThousandAmount,

    };
    console.log('onSetClick() called ' + limitObject);
    this.storage.set('amountLimits', limitObject);
  }

  onSetClick(key: string, value: string){
    console.log('onSetClick() called ' + value);
    this.storage.set(key, value);
    console.log(Number(value));
  }

  backToSettings(){
    this.router.navigateByUrl('settings');
  }

  onGetClick(){
    this.storage.get('printerNum').then(t => console.log(t));
  }


}
