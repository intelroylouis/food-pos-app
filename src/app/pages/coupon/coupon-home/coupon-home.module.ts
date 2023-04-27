import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponHomePageRoutingModule } from './coupon-home-routing.module';

import { CouponHomePage } from './coupon-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponHomePageRoutingModule
  ],
  declarations: [CouponHomePage]
})
export class CouponHomePageModule {}
