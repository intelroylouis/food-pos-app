import { TestBed } from '@angular/core/testing';

import { CashService } from './cash.service';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/Storage';

import { ModalController, AngularDelegate } from '@ionic/angular';


xdescribe('CashService', () => {
  let service: CashService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()],
      providers: [ModalController, AngularDelegate]
    });
    service = TestBed.inject(CashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
