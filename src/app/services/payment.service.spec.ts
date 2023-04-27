import { TestBed } from '@angular/core/testing';

import { PaymentService } from './payment.service';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/Storage';

import { ModalController, AngularDelegate } from '@ionic/angular';



describe('PaymentService', () => {
  let service: PaymentService;
  const event = Object();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()],
      providers: [ModalController, AngularDelegate]
    });
    service = TestBed.inject(PaymentService);
    service.getFullFeaturedWorker();
    service.vescaInit();
    console.log('test9:' + service.FullFeaturedWorker.onmessage)

  });

  it('should be created', () => {
    // service.getFullFeaturedWorker();
    // service.vescaInit();
    expect(service.FullFeaturedWorker.onmessage).not.toBe(undefined);
  });
  it('onFinished: output should be created', () => {
    // event.isTrusted = true;
    event.data = {"OutputCompleteEvent":{"AdditionalSecurityInformation":{"TerminalID":"0001990001001","date":"20/10/21 10:26:03","qrCodeMode":"CPM"},"CurrentService":"QRPayment","CustomerReceipt":[{"attr":"Center","label":"","rowid":1,"value":"自動判別売上票(SALES SLIP)"},{"attr":"Center","label":"","rowid":2,"value":"お客様控え(CUSTOMERS COPY)"},{"attr":"Line","label":"","rowid":3,"value":"-"},{"attr":"Justify","label":"加盟店(MEMBER STORE NAME)","rowid":4,"value":"ベスカ株式会社"},{"attr":"Empty","label":"","rowid":5,"value":"1"},{"attr":"Justify","label":"店舗(STORE NAME)","rowid":6,"value":"日光企画"},{"attr":"Empty","label":"","rowid":7,"value":"1"},{"attr":"Left","label":"","rowid":8,"value":"住所(ADD)"},{"attr":"Left","label":"","rowid":9,"value":"TOKYO"},{"attr":"Justify","label":"電話(TEL NO)","rowid":10,"value":"00-0000-0000"},{"attr":"Line","label":"","rowid":11,"value":"-"},{"attr":"Justify","label":"端末番号(TERM NO)","rowid":12,"value":"0001990001001"},{"attr":"Justify","label":"取引日時(DATE)","rowid":13,"value":"20/10/21 10:26:03"},{"attr":"Justify","label":"取引内容(TRANS CONTENTS)","rowid":14,"value":"売上(SALES)"},{"attr":"Justify","label":"レシート番号(SLIP NO)","rowid":15,"value":"00101382"},{"attr":"Justify","label":"取引通番(TRANS NO)","rowid":16,"value":"Training2020102110260700101382"},{"attr":"Justify","label":"ACQ名称(ACQ NAME)","rowid":17,"value":"日本恒生ソフトウェア株式会社"},{"attr":"Line","label":"","rowid":18,"value":"-"},{"attr":"Justify","label":"支払総計(TOTAL PAYMENT)","rowid":19,"value":"¥440"},{"attr":"Line","label":"","rowid":20,"value":"-"},{"attr":"Empty","label":"","rowid":21,"value":"1"},{"attr":"Center","label":"","rowid":22,"value":"トレーニングモード"}],"MerchantReceipt":[{"attr":"Center","label":"","rowid":1,"value":"自動判別売上票(SALES SLIP)"},{"attr":"Center","label":"","rowid":2,"value":"店舗控え(MERCHANT COPY)"},{"attr":"Line","label":"","rowid":3,"value":"-"},{"attr":"Justify","label":"加盟店(MEMBER STORE NAME)","rowid":4,"value":"ベスカ株式会社"},{"attr":"Empty","label":"","rowid":5,"value":"1"},{"attr":"Justify","label":"店舗(STORE NAME)","rowid":6,"value":"日光企画"},{"attr":"Empty","label":"","rowid":7,"value":"1"},{"attr":"Left","label":"","rowid":8,"value":"住所(ADD)"},{"attr":"Left","label":"","rowid":9,"value":"TOKYO"},{"attr":"Justify","label":"電話(TEL NO)","rowid":10,"value":"00-0000-0000"},{"attr":"Line","label":"","rowid":11,"value":"-"},{"attr":"Justify","label":"端末番号(TERM NO)","rowid":12,"value":"0001990001001"},{"attr":"Justify","label":"取引日時(DATE)","rowid":13,"value":"20/10/21 10:26:03"},{"attr":"Justify","label":"取引内容(TRANS CONTENTS)","rowid":14,"value":"売上(SALES)"},{"attr":"Justify","label":"レシート番号(SLIP NO)","rowid":15,"value":"00101382"},{"attr":"Justify","label":"取引通番(TRANS NO)","rowid":16,"value":"Training2020102110260700101382"},{"attr":"Justify","label":"ACQ名称(ACQ NAME)","rowid":17,"value":"日本恒生ソフトウェア株式会社"},{"attr":"Line","label":"","rowid":18,"value":"-"},{"attr":"Justify","label":"支払総計(TOTAL PAYMENT)","rowid":19,"value":"¥440"},{"attr":"Line","label":"","rowid":20,"value":"-"},{"attr":"Empty","label":"","rowid":21,"value":"1"},{"attr":"Center","label":"","rowid":22,"value":"トレーニングモード"}],"SequenceNumber":31010001,"SettledAmount":440,"SlipNumber":"00101382","TransactionNumber":"Training2020102110260700101382","TransactionType":10}};
    service.onFinished(event.data);
    expect(service.outputJson).not.toBe(undefined);

    // expect(service.getDateAndStorage().toString().length).toBe(10);
  });
  it('onFinished: errorMessage should be created', () => {
    event.data = {"ErrorEvent":{"CurrentService":"Credit","ErrorCode":114,"ErrorCodeExtended":-3,"Errorcodedetail":"J04","Message":"[J04] 入力タイムアウトです。もう一度やり直してください。","SequenceNumber":40010001}};
    service.onFinished(event.data);
    expect(service.errorMessage).not.toBe(undefined);
  });
  it('onFinishedReport: merchantReceipt should be created', async () => {
    event.data = {"OutputCompleteEvent":{"DailyLog":"DailyLog","MerchantReceipt":[{"attr":"Center","label":"","rowid":1,"value":"中間計"},{"attr":"Empty","label":"","rowid":2,"value":"1"},{"attr":"Justify","label":"加盟店名","rowid":3,"value":"日光企画"},{"attr":"Justify","label":"TEL","rowid":4,"value":"00-0000-0000"},{"attr":"Justify","label":"端末識別番号","rowid":5,"value":"0001990001001"},{"attr":"Empty","label":"","rowid":6,"value":"1"},{"attr":"Line","label":"","rowid":7,"value":"="},{"attr":"Left","label":"","rowid":8,"value":"クレジット"},{"attr":"Empty","label":"","rowid":9,"value":"1"},{"attr":"Justify","label":"前回日計日時","rowid":10,"value":"20/10/21 16:28:49"},{"attr":"Justify","label":"集計日時","rowid":11,"value":"20/10/30 10:28:29"},{"attr":"Empty","label":"","rowid":12,"value":"1"},{"attr":"Right","label":"","rowid":13,"value":"取引データ無し"},{"attr":"Line","label":"","rowid":14,"value":"="},{"attr":"Left","label":"","rowid":15,"value":"電子マネー"},{"attr":"Empty","label":"","rowid":16,"value":"1"},{"attr":"Justify","label":"前回日計日時","rowid":17,"value":"20/10/21 16:28:59"},{"attr":"Justify","label":"集計日時","rowid":18,"value":"20/10/30 10:28:30"},{"attr":"Empty","label":"","rowid":19,"value":"1"},{"attr":"Right","label":"","rowid":20,"value":"取引データ無し"},{"attr":"Line","label":"","rowid":21,"value":"="},{"attr":"Left","label":"","rowid":22,"value":"QR決済"},{"attr":"Empty","label":"","rowid":23,"value":"1"},{"attr":"Justify","label":"前回日計日時","rowid":24,"value":"20/10/21 16:29:01"},{"attr":"Justify","label":"集計日時","rowid":25,"value":"20/10/30 10:28:30"},{"attr":"Empty","label":"","rowid":26,"value":"1"},{"attr":"Right","label":"","rowid":27,"value":"取引データ無し"},{"attr":"Line","label":"","rowid":28,"value":"="},{"attr":"Empty","label":"","rowid":29,"value":"1"},{"attr":"Center","label":"","rowid":30,"value":"■■■加盟店控え■■■"}],"SequenceNumber":1}};
    await service.onFinishedReport(event.data);
    expect(service.merchantReceipt).not.toBe(undefined);
  })
});
