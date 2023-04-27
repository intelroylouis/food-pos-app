import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/Storage';


describe('CartService', () => {
  let service: CartService;
  const sampleProducts: Array<any> = [
    { id: 0, name: 'サラミピザ', price: 899, amount: 1 },
    { id: 1, name: 'クラシックピザ', price: 549, amount: 1 },
    { id: 2, name: 'ブレッド', price: 499, amount: 1 },
    { id: 3, name: 'シーザーサラダ', price: 699, amount: 1 },
  ];
// let serviceCart;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()]
    });
    service = TestBed.inject(CartService);
    const serviceCart = (service as any).cart;
    // serviceCart.push(service.data[0]);
    const sampleProduct = { id: 0, name: 'サラミピザ', price: 899, amount: 1 };
    serviceCart.push(sampleProduct);
    serviceCart[0].amount = 2;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be added if true', () => {
    const serviceCart = (service as any).cart;
    // service.addProduct(service.data[0]);
    service.addProduct(sampleProducts[0]);
    // expect(serviceCart).toContain(service.data[0]);
    // expect(serviceCart).toContain(sampleProducts[0]);
    expect(serviceCart[0].amount).toBe(3);
  });
  it('should be added if false', () => {
    service.addProduct(sampleProducts[1]);
    // service.addProduct(service.data[1]);
    const serviceCart = (service as any).cart;
    expect(serviceCart).toContain(sampleProducts[1]);
    // expect(serviceCart).toContain(service.data[1]);
    expect(serviceCart[0].amount).toBe(2);
  });
  it('should be decreased', () => {
    service.decreaseProduct(sampleProducts[0]);
    // service.decreaseProduct(service.data[0]);
    const serviceCart = (service as any).cart;
    expect(serviceCart[0].amount).toBe(1);
  });
  it('should be removed', () => {
    service.removeProduct(sampleProducts[0]);
    // service.removeProduct(service.data[0]);
    const serviceCart = (service as any).cart;
    expect(serviceCart).not.toContain(sampleProducts[0]);
    // expect(serviceCart).not.toContain(service.data[0]);
  });

});
