import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentCashPage } from './payment-cash.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentCashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentCashPageRoutingModule {}
