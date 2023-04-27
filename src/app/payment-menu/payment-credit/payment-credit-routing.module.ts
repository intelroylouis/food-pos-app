import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentCreditPage } from './payment-credit.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentCreditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentCreditPageRoutingModule {}
