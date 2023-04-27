import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReadValueWaitPage } from './read-value-wait.page';

describe('ReadValueWaitPage', () => {
  let component: ReadValueWaitPage;
  let fixture: ComponentFixture<ReadValueWaitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadValueWaitPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadValueWaitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
