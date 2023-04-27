import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponHomePage } from './coupon-home.page';

const routes: Routes = [
  {
    path: '',
    component: CouponHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponHomePageRoutingModule {}
