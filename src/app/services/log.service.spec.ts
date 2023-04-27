import { TestBed } from '@angular/core/testing';

import { LogService } from './log.service';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/Storage';
import { ModalController, AngularDelegate } from '@ionic/angular';


xdescribe('LogService', () => {
  let service: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()],
      providers: [ModalController, AngularDelegate]
    });
    service = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('resOutput should be created', () => {
    service.outputJson();
    service.logJson();
    expect(service.resOutput).not.toBe(undefined);
  })
});
