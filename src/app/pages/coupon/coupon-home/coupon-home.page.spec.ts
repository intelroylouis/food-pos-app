import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CouponHomePage } from './coupon-home.page';

describe('CouponHomePage', () => {
  let component: CouponHomePage;
  let fixture: ComponentFixture<CouponHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CouponHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
