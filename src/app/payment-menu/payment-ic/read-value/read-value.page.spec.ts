import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReadValuePage } from './read-value.page';

describe('ReadValuePage', () => {
  let component: ReadValuePage;
  let fixture: ComponentFixture<ReadValuePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadValuePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadValuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
