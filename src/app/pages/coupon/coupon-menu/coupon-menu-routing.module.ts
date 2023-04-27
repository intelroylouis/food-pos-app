import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponMenuPage } from './coupon-menu.page';

const routes: Routes = [
  {
    path: '',
    component: CouponMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponMenuPageRoutingModule {}
