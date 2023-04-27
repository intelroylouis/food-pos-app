import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CouponMenuPage } from './coupon-menu.page';

describe('CouponMenuPage', () => {
  let component: CouponMenuPage;
  let fixture: ComponentFixture<CouponMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CouponMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
