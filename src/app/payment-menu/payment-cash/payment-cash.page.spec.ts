import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentCashPage } from './payment-cash.page';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/Storage';

// declare var epson: any;


describe('PaymentCashPage', () => {
  let component: PaymentCashPage;
  let fixture: ComponentFixture<PaymentCashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCashPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentCashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
