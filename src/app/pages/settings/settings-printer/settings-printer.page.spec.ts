import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingsPrinterPage } from './settings-printer.page';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/Storage';


describe('SettingsPrinterPage', () => {
  let component: SettingsPrinterPage;
  let fixture: ComponentFixture<SettingsPrinterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPrinterPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPrinterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
