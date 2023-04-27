import { TestBed } from '@angular/core/testing';

import { PrintService } from './print.service';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/Storage';

import { ModalController, AngularDelegate } from '@ionic/angular';

import 'src/assets/js/epos-2.14.0.js';

// declare epson;



describe('PrintService', () => {
  let service: PrintService;
  // console.log('epson' + epson);

  // service.ePosDev = new epson.ePOSDevice();
  // let epson = require('src/assets/js/epos-2.14.0.js');


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()],
      providers: [ModalController, AngularDelegate]
    });
    service = TestBed.inject(PrintService);

  });
  it('getDate() should be formatted', () => {
    service.getDate();
    console.log('jasmine nowDate' + service.nowDate);
    expect(service.nowDate.length).toBe(14);
    expect(service.nowTime.length).toBe(5);
  });
  it('printer device should be created', () => {
    const data = '<epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print"></epos-print>';
    service.setLocalPrinter();
    service.callbackCreateDevice_printer(data);
    expect(service.printer).not.toBe(null);
  });
  it('kitchen printer device should be created', () => {
    const data = '<epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print"></epos-print>';
    // service.setKitchenPrinter();
    service.deviceID = 'kp01';
    service.callbackCreateDevice_printer(data);
    expect(service.kitchenPrinter).not.toBe(null);
  });


  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
