import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentQrPage } from './payment-qr.page';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import {IonicStorageModule} from '@ionic/Storage';


describe('PaymentQrPage', () => {
  let component: PaymentQrPage;
  let fixture: ComponentFixture<PaymentQrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentQrPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
