import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EatinMessagePage } from './eatin-message.page';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/Storage';

describe('EatinMessagePage', () => {
  let component: EatinMessagePage;
  let fixture: ComponentFixture<EatinMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EatinMessagePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EatinMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
