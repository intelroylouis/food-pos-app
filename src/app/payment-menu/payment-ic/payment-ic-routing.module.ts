import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentIcPage } from './payment-ic.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentIcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentIcPageRoutingModule {}
