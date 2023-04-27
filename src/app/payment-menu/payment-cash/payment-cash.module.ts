import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentCashPageRoutingModule } from './payment-cash-routing.module';

import { PaymentCashPage } from './payment-cash.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { CartCheckPageModule } from 'src/app/pages/cart-check/cart-check.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PaymentCashPageRoutingModule,
        FontAwesomeModule,
        CartCheckPageModule
    ],
  declarations: [PaymentCashPage]
})
export class PaymentCashPageModule {}
