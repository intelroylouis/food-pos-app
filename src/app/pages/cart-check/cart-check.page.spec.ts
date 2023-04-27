import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartCheckPage } from './cart-check.page';

describe('CartCheckPage', () => {
  let component: CartCheckPage;
  let fixture: ComponentFixture<CartCheckPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartCheckPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CartCheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
