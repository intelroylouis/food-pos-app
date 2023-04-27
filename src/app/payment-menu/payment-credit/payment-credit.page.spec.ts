import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentCreditPage } from './payment-credit.page';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/Storage';


describe('PaymentCreditPage', () => {
  let component: PaymentCreditPage;
  let fixture: ComponentFixture<PaymentCreditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCreditPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentCreditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
