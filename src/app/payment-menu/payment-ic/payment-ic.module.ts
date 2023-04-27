import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentIcPageRoutingModule } from './payment-ic-routing.module';

import { PaymentIcPage } from './payment-ic.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { CartCheckPageModule } from 'src/app/pages/cart-check/cart-check.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PaymentIcPageRoutingModule,
        FontAwesomeModule,
        CartCheckPageModule
    ],
  declarations: [PaymentIcPage]
})
export class PaymentIcPageModule {}
