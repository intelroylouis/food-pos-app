import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


import { IonicModule } from '@ionic/angular';

import { CouponMenuPageRoutingModule } from './coupon-menu-routing.module';

import { CouponMenuPage } from './coupon-menu.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponMenuPageRoutingModule,
    NgxPaginationModule,
    FontAwesomeModule,
  ],
  declarations: [CouponMenuPage]
})
export class CouponMenuPageModule {}
