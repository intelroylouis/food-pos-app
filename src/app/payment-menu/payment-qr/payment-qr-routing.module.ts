import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentQrPage } from './payment-qr.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentQrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentQrPageRoutingModule {}
