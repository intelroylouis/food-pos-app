import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MugMessagePage } from './mug-message.page';

describe('MugMessagePage', () => {
  let component: MugMessagePage;
  let fixture: ComponentFixture<MugMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MugMessagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MugMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
