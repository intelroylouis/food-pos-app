import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMenuPage } from './payment-menu.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentMenuPage
  },
  {
    path: 'payment-cash',
    loadChildren: () => import('./payment-cash/payment-cash.module').then( m => m.PaymentCashPageModule)
  },
  {
    path: 'payment-credit',
    loadChildren: () => import('./payment-credit/payment-credit.module').then( m => m.PaymentCreditPageModule)
  },
  {
    path: 'payment-ic',
    loadChildren: () => import('./payment-ic/payment-ic.module').then( m => m.PaymentIcPageModule)
  },
  {
    path: 'payment-qr',
    loadChildren: () => import('./payment-qr/payment-qr.module').then( m => m.PaymentQrPageModule)
  },
  {
    path: 'payment-error',
    loadChildren: () => import('./payment-error/payment-error.module').then( m => m.PaymentErrorPageModule)
  },
  {
    path: 'payment-success',
    loadChildren: () => import('./payment-success/payment-success.module').then( m => m.PaymentSuccessPageModule)
  },
  {
    path: 'read-value-wait',
    loadChildren: () => import('./payment-ic/read-value-wait/read-value-wait.module').then( m => m.ReadValueWaitPageModule)
  },
  {
    path: 'payment-ic/read-value',
    loadChildren: () => import('./payment-ic/read-value/read-value.module').then( m => m.ReadValuePageModule)
  },
  {
    path: 'payment-error/read-value',
    loadChildren: () => import('./payment-error/read-value/read-value.module').then( m => m.ReadValuePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMenuPageRoutingModule {}
